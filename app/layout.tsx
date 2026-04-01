import type { Metadata } from "next";
import "./globals.css";
import SWRegister from "./sw-register";
import OfflineBanner from "../components/offline-banner";

export const metadata: Metadata = {
  title: "VoiceHive | Honig-Pott Wening",
  description:
    "Professionelle Imker-App für Spracheingabe, Durchsichten und Offline-Synchronisierung.",
  icons: {
    icon: "/branding/icon-32.png",
    apple: "/branding/icon-180.png",
    shortcut: "/branding/icon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          background:
            "linear-gradient(180deg, #fffdf8 0%, #fff9eb 35%, #ffffff 100%)",
        }}
      >
        <SWRegister />
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}