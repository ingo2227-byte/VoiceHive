import "dotenv/config";
import { defineConfig } from "prisma/config";

const cliUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!cliUrl) {
  throw new Error(
    "Setze DATABASE_URL oder DIRECT_URL in deiner .env, damit Prisma CLI laufen kann."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: cliUrl,
  },
});
