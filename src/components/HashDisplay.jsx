"use client";
import { useClipboard } from "@/hooks/useClipboard";
export default function HashDisplay({ hash }) {
  const { copy, copied } = useClipboard();
  if (!hash) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, background:"#111", border:"2px solid #333", padding:"8px 12px" }}>
      <span style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A", flex:1, wordBreak:"break-all" }}>{hash}</span>
      <button onClick={() => copy(hash)} style={{ border:"2px solid #f5f0e8", background:"transparent", color:"#f5f0e8", padding:"4px 8px", fontFamily:"Archivo Black, sans-serif", fontSize:10, cursor:"pointer", whiteSpace:"nowrap" }}>
        {copied ? "COPIED!" : "COPY"}
      </button>
    </div>
  );
}
