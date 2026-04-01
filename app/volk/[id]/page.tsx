import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth";

export default async function VolkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    return <main style={{ padding: 24 }}>Volk nicht gefunden.</main>;
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24, display: "grid", gap: 24 }}>
      <section style={heroStyle}>
        <div>
          <p style={{ margin: 0, color: "#92400e", fontWeight: 700 }}>Volk</p>
          <h1 style={{ margin: "8px 0 10px" }}>{hive.name}</h1>
          <p style={{ margin: 0, color: "#555" }}>Standort: {hive.location || "—"}</p>
        </div>
        <Link href="/" style={linkStyle}>Zurück zur Übersicht</Link>
      </section>

      <section style={panelStyle}>
        <h2 style={{ marginTop: 0 }}>Durchsichtsverlauf</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {hive.inspections.length === 0 ? (
            <p>Noch keine Durchsichten vorhanden.</p>
          ) : (
            hive.inspections.map((inspection) => (
              <article key={inspection.id} style={cardStyle}>
                <strong>{new Date(inspection.inspectedAt).toLocaleDateString("de-DE")}</strong>
                <div>Brutwaben: {inspection.broodFrames ?? "—"}</div>
                <div>Honigwaben: {inspection.honeyFrames ?? "—"}</div>
                <div>
                  Königin: {inspection.queenSeen === true ? "gesehen" : inspection.queenSeen === false ? "nicht gesehen" : "—"}
                </div>
                <div>Verhalten: {inspection.temperament ?? "—"}</div>
                <div>Notiz: {inspection.notes ?? "—"}</div>
              </article>
            ))
          )}
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={{ marginTop: 0 }}>Freie Notizen</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {hive.notes.length === 0 ? (
            <p>Noch keine Notizen vorhanden.</p>
          ) : (
            hive.notes.map((note) => (
              <article key={note.id} style={cardStyle}>
                <strong>{new Date(note.createdAt).toLocaleDateString("de-DE")}</strong>
                <div>Quelle: {note.source || "—"}</div>
                <div>{note.text}</div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

const heroStyle = {
  border: "1px solid #fde68a",
  borderRadius: 20,
  padding: 24,
  background: "linear-gradient(135deg, #fff7ed 0%, #fefce8 100%)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap" as const,
};

const panelStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  padding: 24,
  background: "#fff",
};

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
  display: "grid",
  gap: 8,
};

const linkStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: "12px 16px",
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
};
