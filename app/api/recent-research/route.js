import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const recentResearch = await db
      .collection("publications")
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    return NextResponse.json(recentResearch, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recent research:", error);
    return NextResponse.json({ error: "Failed to fetch recent research" }, { status: 500 });
  }
}
