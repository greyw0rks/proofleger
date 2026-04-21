"use client";
import { useClipboard } from "@/hooks/useClipboard";
import ReputationBadge from "./ReputationBadge";

export default function ProfileHeader({ address, score = 0, docCount = 0 }) {
  const { copy, copied } = useClipboard();
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22,
            color:"#f5f0e8", marginBottom:6 }}>
            {address?.slice(0,8)}...{address?.slice(-6)}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <ReputationBadge score={score} showScore />
            {docCount > 0 && (
              <span style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555" }}>
                {docCount} document{docCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => copy(address)}
            style={{ border:"2px solid #333", background:"transparent",
              color:"#666", padding:"6px 12px", fontFamily:"Archivo Black, sans-serif",
              fontSize:9, cursor:"pointer", letterSpacing:1 }}>
            {copied ? "COPIED" : "COPY"}
          </button>
          <a href={`https://explorer.hiro.so/address/${address}`}
            target="_blank" rel="noreferrer"
            style={{ border:"2px solid #333", color:"#666", padding:"6px 12px",
              fontFamily:"Archivo Black, sans-serif", fontSize:9,
              textDecoration:"none", letterSpacing:1 }}>
            EXPLORER ↗
          </a>
        </div>
      </div>
    </div>
  );
}