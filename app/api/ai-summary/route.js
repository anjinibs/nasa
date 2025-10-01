// app/api/summarize/route.js
import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

/* --- Init Gemini client --- */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithGemini(prompt) {
  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash", // or another Gemini model
    contents: [{ parts: [{ text: prompt }] }],
  });
  const candidate = resp.candidates?.[0];
  return candidate?.content?.parts?.map(p => p.text).join("") ?? "";
}

/* --- Helpers --- */
async function fetchBioCJson(pmcid) {
  const url = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${pmcid}/unicode`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`BioC fetch failed ${r.status}`);
  return r.json();
}

function extractFromBioC(biocJson) {
  const docs = biocJson?.collection?.documents ?? [];
  const parts = [];
  for (const doc of docs) {
    for (const passage of doc.passages ?? []) {
      if (passage.text) parts.push(passage.text);
    }
  }
  return parts.join("\n\n").trim();
}

async function fetchHtml(url) {
  // Provide a user agent to reduce blocking by some sites
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MySummarizer/1.0)" } });
  if (!res.ok) throw new Error(`HTML fetch failed ${res.status}`);
  return res.text();
}

function extractWithReadability(html, url) {
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;
  const article = new Readability(doc).parse();
  if (article?.textContent) return article.textContent;
  return null;
}

function fallbackCheerioExtract(html) {
  const $ = cheerio.load(html);
  // Prefer <article>, then <main>, else gather <p> text from body
  const articleText =
    ($("article").text() || $("main").text() || $("body").text() || "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return articleText;
}

/* --- Main API handler --- */
export async function POST(req) {
  try {
    const { link } = await req.json();
    if (!link) throw new Error("Missing 'link' in request body");

    // 1) If PMC ID present -> use BioC API (structured)
    const pmcMatch = link.match(/PMC\d+/i);
    let fullText = "";

    if (pmcMatch) {
      try {
        const pmcid = pmcMatch[0];
        const bioc = await fetchBioCJson(pmcid);
        fullText = extractFromBioC(bioc);
      } catch (bioErr) {
        console.warn("BioC failed:", bioErr);
      }
    }

    // 2) If not obtained from API, fetch HTML & extract main content
    if (!fullText || fullText.length < 50) {
      const html = await fetchHtml(link);
      // Prefer Readability for robust main content extraction
      const extracted = extractWithReadability(html, link);
      fullText = extracted || fallbackCheerioExtract(html);
    }

    if (!fullText || fullText.length < 20) {
      throw new Error("Could not extract useful content from the link");
    }

    // 3) (Optional) chunking: if content is huge, you may summarize chunks then synthesize
    // For simplicity, we send the full content and ask Gemini to produce JSON.
    // If you expect very large pages, implement chunk+map-reduce summarization here.

    // 4) Prompt Gemini, instruct strict JSON output
    const prompt = `
You are an expert scientific summarizer. Return ONLY valid JSON (no extra commentary).
Format:
{
  "summary": "A concise few-paragraph summary (string)",
  "keyPoints": ["short bullet 1", "short bullet 2", "..."] 
}
Article text:
${fullText}
    `.trim();

    const modelOutput = await generateWithGemini(prompt);

    // 5) Robustly extract the first JSON object from the model output
    let jsonText = null;
    const jsonMatch = modelOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonText = jsonMatch[0];
    else jsonText = modelOutput; // last resort

    let parsed = null;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      // If parsing fails, fallback to using raw text as summary
      parsed = { summary: modelOutput.trim(), keyPoints: [] };
    }

    const aiSummary = parsed.summary || parsed.aiSummary || parsed.text || "";
    const keyPoints = Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [];

    return NextResponse.json({ aiSummary, keyPoints });
  } catch (err) {
    console.error("summarize error:", err);
    return NextResponse.json({
      aiSummary: `Could not summarize: ${err.message}`,
      keyPoints: [],
    });
  }
}
