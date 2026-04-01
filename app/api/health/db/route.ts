import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function maskConnectionString(value?: string) {
  if (!value) return "missing";
  return value.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
}

export async function GET() {
  try {
    console.log("DATABASE_URL:", maskConnectionString(process.env.DATABASE_URL));
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "reachable" });
  } catch (error) {
    console.error("GET /api/health/db failed:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    const cause =
      typeof error === "object" && error !== null && "cause" in error
        ? String((error as { cause?: unknown }).cause)
        : null;

    return NextResponse.json(
      { ok: false, database: "unreachable", message, cause },
      { status: 500 }
    );
  }
}