import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithGemini(promptText) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      // You can configure temperature, safety, etc.
    });
    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join("") ?? "";
    return text;
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

export async function POST(req) {
  try {
    const { link, title } = await req.json();
    const pmcMatch = link.match(/PMC\d+/);
    if (!pmcMatch) {
      throw new Error("Invalid PMC link: " + link);
    }
    const pmcid = pmcMatch[0];

    const xmlUrl = `https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi?id=${pmcid}&format=xml`;
    console.log("Fetching XML from:", xmlUrl);

    const xmlRes = await fetch(xmlUrl);
    if (!xmlRes.ok) {
      console.error("XML fetch failed", xmlRes.status, xmlRes.statusText);
      throw new Error(`Failed to fetch PMC XML (status ${xmlRes.status})`);
    }
    const xmlText = await xmlRes.text();

    let fullText = "";
    try {
      const parsed = await parseStringPromise(xmlText);
      // Safely navigate structure
      const articleNode = parsed?.articles?.article?.[0];
      const bodyNode = articleNode?.body?.[0];

      const secs = bodyNode?.sec ?? [];
      const paragraphs = [];

      if (secs.length > 0) {
        for (const sec of secs) {
          const ps = sec?.p ?? [];
          for (const p of ps) {
            if (typeof p === "string") {
              paragraphs.push(p);
            } else if (p._) {
              paragraphs.push(p._);
            } else {
              // fallback deeper nested text
              const text = p?.["#text"] ?? "";
              if (text) paragraphs.push(text);
            }
          }
        }
      } else {
        // fallback: direct <p> under body
        const directPs = bodyNode?.p ?? [];
        for (const p of directPs) {
          if (typeof p === "string") {
            paragraphs.push(p);
          } else if (p._) {
            paragraphs.push(p._);
          } else {
            const text = p?.["#text"] ?? "";
            if (text) paragraphs.push(text);
          }
        }
      }

      fullText = paragraphs.join("\n").trim();

      if (!fullText) {
        console.warn("No fullText extracted from XML; using title fallback");
        fullText = title;
      }
    } catch (err) {
      console.warn("XML parse/traversal error:", err);
      fullText = title;
    }

    // Build prompt
    const prompt = `
You are an expert scientific summarizer.
Given the following full text of a research article, produce:
1. A concise summary (a few paragraphs)
2. A list of 3–5 key points (bullet or numbered)

Full Text:
${fullText}
    `;

    const resultText = await generateWithGemini(prompt);

    // Optionally, parse `resultText` if you design the prompt to return JSON.
    // For now, we just put it into aiSummary and leave keyPoints empty or try to parse.

    return NextResponse.json({
      aiSummary: resultText,
      keyPoints: [],  // you can attempt to parse keyPoints from resultText if the model outputs them
    });

  } catch (error) {
    console.error("POST /api/ai-summary error:", error);
    return NextResponse.json({
      aiSummary: `Preview content not available. Title fallback: ${error.message}`,
      keyPoints: [],
    });
  }
}
