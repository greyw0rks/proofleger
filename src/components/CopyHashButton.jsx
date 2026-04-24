"use client";
import { useClipboard } from "@/hooks/useClipboard";

export default function CopyHashButton({ hash, shorten = true }) {
  const { copy, copied } = useClipboard();
  const display = shorten && hash?.length > 16
    ? `${hash.slice(0, 8)}...${hash.slice(-6)}`
    : hash;
  return (
    <button onClick={() => copy(hash)}
      style={{ border:"2px solid #333", background:"transparent",
        color: copied ? "#00ff88" : "#666",
        padding:"4px 12px", fontFamily:"Space Mono, monospace",
        fontSize:10, cursor:"pointer", display:"flex",
        alignItems:"center", gap:6, transition:"color 0.2s" }}>
      <span style={{ fontFamily:"Space Mono, monospace",
        fontSize:9 }}>{display}</span>
      <span>{copied ? "✓" : "⎘"}</span>
    </button>
  );
}