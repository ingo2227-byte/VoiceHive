"use client";

import { useEffect } from "react";

export type ToastTone = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  text: string;
  tone: ToastTone;
};

export function Toast({
  message,
  onDismiss,
}: {
  message: ToastMessage | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const background =
    message.tone === "success"
      ? "#ecfdf5"
      : message.tone === "error"
      ? "#fef2f2"
      : "#eff6ff";

  const border =
    message.tone === "success"
      ? "#a7f3d0"
      : message.tone === "error"
      ? "#fecaca"
      : "#bfdbfe";

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        maxWidth: 360,
        zIndex: 1000,
        padding: "14px 16px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        background,
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        color: "#111827",
        fontWeight: 600,
      }}
    >
      {message.text}
    </div>
  );
}
