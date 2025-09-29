import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

// Dummy AI function – replace with OpenAI/Gemini API if available
async function generateAISummary(text) {
  return {
    aiSummary: `AI Summary (preview):\n${text.slice(0, 500)}...`,
    keyPoints: [
      "Key Point 1: AI extracted insight",
      "Key Point 2: AI extracted insight",
      "Key Point 3: AI extracted insight",
    ],
  };
}

export async function POST(req) {
  try {
    const { link, title } = await req.json();
    const pmcMatch = link.match(/PMC\d+/);
    if (!pmcMatch) throw new Error("Invalid PMC link");
    const pmcid = pmcMatch[0];

    // Fetch OA full-text XML
    const xmlRes = await fetch(`https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi?id=${pmcid}&format=xml`);
    if (!xmlRes.ok) throw new Error("Failed to fetch PMC XML");
    const xmlText = await xmlRes.text();

    // Parse XML to text
    const parsed = await parseStringPromise(xmlText);
    let fullText = "";

    try {
      const body = parsed['articles']['article'][0]['body'][0]['sec'] || [];
      fullText = body.map(section => (section['p'] || []).map(p => p._ || "").join("\n")).join("\n");
    } catch (err) {
      fullText = title; // fallback to title if body not found
    }

    const summaryData = await generateAISummary(fullText);
    return NextResponse.json(summaryData);
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json({
      aiSummary: "Preview content not available, using title only...",
      keyPoints: [
        "Key Point 1: AI insight",
        "Key Point 2: AI insight",
        "Key Point 3: AI insight",
      ],
    });
  }
}
