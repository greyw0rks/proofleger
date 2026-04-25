"use client";
import { useClipboard } from "@/hooks/useClipboard";

export default function CopyButton({ text, label = "COPY", copiedLabel = "COPIED", size = "sm" }) {
  const { copy, copied } = useClipboard(1800);
  const pad = size === "lg" ? "10px 20px" : "5px 12px";
  const fs  = size === "lg" ? 12 : 9;

  return (
    <button
      onClick={() => copy(text)}
      style={{
        border: `2px solid ${copied ? "#00ff88" : "#333"}`,
        background: "transparent",
        color: copied ? "#00ff88" : "#555",
        padding: pad,
        fontFamily: "Archivo Black, sans-serif",
        fontSize: fs,
        cursor: "pointer",
        letterSpacing: 1,
        transition: "color 0.15s, border-color 0.15s",
      }}>
      {copied ? `✓ ${copiedLabel}` : label}
    </button>
  );
}