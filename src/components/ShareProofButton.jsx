"use client";
import { useClipboard } from "@/hooks/useClipboard";

const VERIFY_BASE = process.env.NEXT_PUBLIC_VERIFY_URL
  || "https://verify.proofleger.vercel.app";

export default function ShareProofButton({ hash, size = "sm" }) {
  const { copy, copied } = useClipboard(2000);
  if (!hash) return null;

  const url = `${VERIFY_BASE}?hash=${hash}`;
  const pad = size === "lg" ? "10px 20px" : "5px 12px";
  const fs  = size === "lg" ? 10 : 8;

  return (
    <button onClick={() => copy(url)}
      style={{ border: `2px solid ${copied ? "#00ff88" : "#333"}`,
        background: "transparent",
        color: copied ? "#00ff88" : "#555",
        padding: pad,
        fontFamily: "Archivo Black, sans-serif",
        fontSize: fs, cursor: "pointer", letterSpacing: 1,
        transition: "color 0.15s, border-color 0.15s" }}>
      {copied ? "✓ LINK COPIED" : "↗ SHARE PROOF"}
    </button>
  );
}