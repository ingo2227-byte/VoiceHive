import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth";

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserOrThrow();
    const { id } = await params;

    const hive = await prisma.hive.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        inspections: {
          orderBy: { inspectedAt: "desc" },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!hive) {
      return NextResponse.json({ error: "Volk nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json(hive);
  } catch (error) {
    console.error("GET /api/voelker/[id] failed:", error);
    return NextResponse.json({ error: "Volk konnte nicht geladen werden." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserOrThrow();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.hive.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Volk nicht gefunden." }, { status: 404 });
    }

    const updated = await prisma.hive.update({
      where: { id },
      data: {
        name: body.name?.trim() || existing.name,
        location:
          body.location === undefined
            ? existing.location
            : body.location?.trim() || null,
        inspections: {
          create: {
            ownerId: user.id,
            inspectedAt: body.inspectedAt ? new Date(body.inspectedAt) : new Date(),
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/voelker/[id] failed:", error);
    return NextResponse.json(
      { error: "Volk konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserOrThrow();
    const { id } = await params;

    const existing = await prisma.hive.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Volk nicht gefunden." }, { status: 404 });
    }

    await prisma.hive.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/voelker/[id] failed:", error);
    return NextResponse.json(
      { error: "Volk konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
