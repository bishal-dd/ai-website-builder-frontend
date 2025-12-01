import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("https://ipwhois.app/json/");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Geo fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch geo data" },
      { status: 500 }
    );
  }
}
