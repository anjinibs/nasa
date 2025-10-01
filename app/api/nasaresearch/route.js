    import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) 
    return NextResponse.json({ error: "No query provided" }, { status: 400 });

  try {
    const response = await fetch(
      `https://ntrs.nasa.gov/api/citations/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("NTRS API error:", errText);
      return NextResponse.json({ error: "Failed to fetch research papers" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, link } = await req.json();

    // Enhanced validation
    if (!title || typeof title !== 'string' || title.length < 3) {
      return NextResponse.json({ error: "A valid title of at least 3 characters is required" }, { status: 400 });
    }
    
    try {
      new URL(link);
    } catch (_) {
      return NextResponse.json({ error: "A valid URL is required for the link" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const newResearch = {
      title,
      link,
      createdAt: new Date(),
    };

    const result = await db.collection("publications").insertOne(newResearch);
    
    const insertedDocument = { ...newResearch, _id: result.insertedId };

    return NextResponse.json(insertedDocument, { status: 201 });
  } catch (error) {
    console.error("Failed to add research:", error);
    return NextResponse.json({ error: "Failed to add research to the database" }, { status: 500 });
  }
}
