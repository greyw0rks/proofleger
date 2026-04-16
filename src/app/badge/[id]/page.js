"use client";
import { use } from "react";
import { useClipboard } from "@/hooks/useClipboard";

const BADGE_META = {
  "top-contributor": { emoji:"🏆", title:"Top Contributor", desc:"Awarded to the most active ProofLedger contributors", color:"#F7931A" },
  "first-anchor":    { emoji:"⚓", title:"First Anchor", desc:"Anchored your first document to Bitcoin", color:"#38bdf8" },
  "verified-issuer": { emoji:"✓",  title:"Verified Issuer", desc:"Recognized trusted credential issuer", color:"#00ff88" },
  "100-proofs":      { emoji:"💯", title:"Century Mark", desc:"Anchored 100 documents to Bitcoin", color:"#a78bfa" },
};

export default function BadgePage({ params }) {
  const { id } = use(params);
  const { copy, copied } = useClipboard();
  const meta = BADGE_META[id] || { emoji:"🎖️", title:`Badge: ${id}`, desc:"ProofLedger Achievement", color:"#F7931A" };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ border:`3px solid ${meta.color}`, padding:40, textAlign:"center",
        boxShadow:`8px 8px 0 ${meta.color}`, maxWidth:400, width:"100%" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>{meta.emoji}</div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22,
          color:meta.color, marginBottom:8 }}>{meta.title}</div>
        <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
          color:"#666", marginBottom:24, lineHeight:1.6 }}>{meta.desc}</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => copy(shareUrl)}
            style={{ border:`2px solid ${meta.color}`, background:"transparent",
              color:meta.color, padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>
            {copied ? "COPIED!" : "SHARE"}
          </button>
          <a href="/"
            style={{ border:"2px solid #333", color:"#666", padding:"8px 16px",
              fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
            HOME
          </a>
        </div>
      </div>
    </div>
  );
}