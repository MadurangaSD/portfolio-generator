import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = (url.searchParams.get("username") || "").trim().toLowerCase();
    if (!username) return NextResponse.json({ available: false }, { status: 200 });

    const existing = await prisma.portfolio.findUnique({ where: { username } });
    return NextResponse.json({ available: existing ? false : true });
  } catch (error) {
    console.error("[username availability] Error:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
