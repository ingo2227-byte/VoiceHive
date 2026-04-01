"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      style={{
        background: "#f59e0b",
        color: "#111827",
        padding: "12px 16px",
        textAlign: "center",
        fontWeight: 800,
        fontSize: 14,
      }}
    >
      Offline-Modus: Deine Eingaben werden lokal gespeichert.
    </div>
  );
}