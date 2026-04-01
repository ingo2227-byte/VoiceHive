-- CreateTable
CREATE TABLE "Volk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stand" TEXT NOT NULL,
    "letzteDurchsicht" TIMESTAMP(3) NOT NULL,
    "brutwaben" INTEGER NOT NULL DEFAULT 0,
    "futterwaben" INTEGER NOT NULL DEFAULT 0,
    "koeniginGesehen" BOOLEAN NOT NULL DEFAULT false,
    "verhalten" TEXT,
    "notiz" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volk_pkey" PRIMARY KEY ("id")
);
