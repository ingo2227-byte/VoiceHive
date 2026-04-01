import { prisma } from "@/lib/prisma";

export type AppUser = {
  id: string;
  email: string;
  displayName: string | null;
};

const DEV_USER_ID = process.env.DEV_USER_ID ?? "dev-local-user";
const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL ?? "demo@voicehive.local";
const DEV_USER_NAME = process.env.DEV_USER_NAME ?? "VoiceHive Demo";

export async function getCurrentUserOrThrow(): Promise<AppUser> {
  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {
      displayName: DEV_USER_NAME,
    },
    create: {
      id: DEV_USER_ID,
      email: DEV_USER_EMAIL,
      displayName: DEV_USER_NAME,
    },
  });

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };
}