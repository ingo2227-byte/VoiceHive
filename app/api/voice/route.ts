import { NextResponse } from "next/server";
import { parseVoiceText } from "@/lib/voice-parser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawText = String(body.text || "").trim();

    if (!rawText) {
      return NextResponse.json(
        { error: "Kein Sprachtext übergeben." },
        { status: 400 }
      );
    }

    return NextResponse.json(parseVoiceText(rawText));
  } catch (error) {
    console.error("POST /api/voice failed", error);
    return NextResponse.json(
      { error: "Sprachtext konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
