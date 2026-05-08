import { NextResponse } from "next/server";
import { ensureConnected, getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = (url.searchParams.get("username") || "").trim().toLowerCase();
    if (!username) return NextResponse.json({ available: false }, { status: 200 });

    await ensureConnected();
    const db = getDb();
    const portfolios = db.collection("Portfolio");
    const existing = await portfolios.findOne({ username });
    return NextResponse.json({ available: existing ? false : true });
  } catch (error) {
    console.error("[username availability] Error:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
