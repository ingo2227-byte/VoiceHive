import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth";

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const user = await getCurrentUserOrThrow();

    const hives = await prisma.hive.findMany({
      where: { ownerId: user.id },
      include: {
        inspections: {
          orderBy: { inspectedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const payload = hives.map((hive) => ({
      id: hive.id,
      name: hive.name,
      location: hive.location,
      createdAt: hive.createdAt,
      updatedAt: hive.updatedAt,
      latestInspection: hive.inspections[0] ?? null,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/voelker failed:", error);
    return NextResponse.json(
      { error: "Völker konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserOrThrow();
    const body = await req.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Bitte einen Volk-Namen angeben." },
        { status: 400 }
      );
    }

    const inspectedAt = body.inspectedAt ? new Date(body.inspectedAt) : new Date();

    const hive = await prisma.hive.create({
      data: {
        ownerId: user.id,
        name: body.name.trim(),
        location: body.location?.trim() || null,
        inspections: {
          create: {
            ownerId: user.id,
            inspectedAt,
            broodFrames: toNumberOrNull(body.broodFrames),
            honeyFrames: toNumberOrNull(body.honeyFrames),
            queenSeen:
              typeof body.queenSeen === "boolean" ? body.queenSeen : null,
            temperament: body.temperament?.trim() || null,
            notes: body.notes?.trim() || null,
          },
        },
        notes: body.notes?.trim()
          ? {
              create: {
                ownerId: user.id,
                text: body.notes.trim(),
                source: "manual",
              },
            }
          : undefined,
      },
      include: {
        inspections: {
          orderBy: { inspectedAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(hive, { status: 201 });
  } catch (error) {
    console.error("POST /api/voelker failed:", error);
    return NextResponse.json(
      { error: "Volk konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}