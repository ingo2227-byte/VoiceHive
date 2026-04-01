# VoiceHive

VoiceHive ist eine Next.js-App für die digitale Stockkarte mit Spracheingabe,
Offline-Queue und Prisma 7 auf PostgreSQL.

## Aktueller Stand

- Next.js App Router
- Prisma 7 mit `prisma.config.ts`
- PostgreSQL via `@prisma/adapter-pg`
- Offline-Sync über `localStorage`
- Spracheingabe mit Browser SpeechRecognition
- Detailansicht für Verlauf und Notizen
- Toasts statt `alert()`
- Datenbank-Healthcheck unter `/api/health/db`

## Start

```bash
npm install
npx prisma generate
npm run dev
```

## Wichtige ENV Variablen

```env
DATABASE_URL="postgresql://..."
DEV_USER_ID="dev-local-user"
DEV_USER_EMAIL="demo@voicehive.local"
DEV_USER_NAME="VoiceHive Demo"
```

## Wenn die Online-Datenbank noch nicht funktioniert

Bei Supabase war vorher eine ältere `Volk`-Struktur aktiv. Das aktuelle Projekt
arbeitet aber mit `User`, `Hive`, `Inspection`, `HiveNote` und `VoiceCapture`.

### Entwicklungsdatenbank neu aufsetzen

Wenn du die alten Entwicklungsdaten nicht behalten musst:

```bash
npx prisma migrate reset
npx prisma migrate dev --name init_clean
```

### Verbindung testen

Starte die App und rufe danach auf:

```txt
/api/health/db
```

Erwartet wird:

```json
{ "ok": true, "database": "reachable" }
```


### Supabase / PgBouncer

Wenn du für die App den Supabase-Pooler verwendest, setze für Runtime und CLI
unterschiedliche URLs:

```env
DATABASE_URL="postgresql://...pooler.../postgres?pgbouncer=true"
DIRECT_URL="postgresql://...direct-host.../postgres"
```

Die App nutzt `DATABASE_URL`, Prisma-CLI-Befehle wie `migrate dev` oder `db push`
nutzen über `prisma.config.ts` bevorzugt `DIRECT_URL`. Das entspricht der
empfohlenen Prisma-Konfiguration für PgBouncer/Supabase.

## Struktur

- `app/api/voelker` – CRUD für Völker
- `app/api/health/db` – Datenbanktest
- `app/page.tsx` – Dashboard mit Voice, Formular und Liste
- `app/volk/[id]/page.tsx` – Verlauf je Volk
- `lib/prisma.ts` – zentraler Prisma Client
- `lib/offline-queue.ts` – Offline-Queue
- `lib/voice-parser.ts` – einfacher Sprachparser

## Hinweise

- Das Projekt nutzt aktuell einen lokalen Demo-User statt Supabase-Login.
- Die alte formularbezogene Abfrageauswahl ist absichtlich deaktiviert, bis sie
  auf ein eigenes Datenmodell umgestellt wird.
