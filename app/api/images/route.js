import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("NASA Image API error:", errText);
      return NextResponse.json(
        { error: "Failed to fetch NASA images" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}