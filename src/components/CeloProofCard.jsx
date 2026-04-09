"use client";
import { CELO_EXPLORER } from "@/lib/wallet-celo";
export default function CeloProofCard({ hash, title, docType, blockNumber, owner, attestationCount = 0, txHash }) {
  const short = (s, n=8) => s ? `${s.slice(0,n)}...${s.slice(-n)}` : "";
  return (
    <div style={{ border:"3px solid #35D07F", padding:20, background:"#0a0a0a", boxShadow:"6px 6px 0 #35D07F", marginBottom:16 }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18, color:"#f5f0e8", marginBottom:8 }}>{title || "Untitled"}</div>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#35D07F", marginBottom:12, wordBreak:"break-all" }}>{short(hash, 16)}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        <span style={{ border:"2px solid #35D07F", color:"#35D07F", padding:"2px 8px", fontSize:10, fontFamily:"Archivo Black, sans-serif" }}>{docType?.toUpperCase()}</span>
        <span style={{ border:"2px solid #FCFF52", color:"#FCFF52", padding:"2px 8px", fontSize:10, fontFamily:"Archivo Black, sans-serif" }}>CELO #{blockNumber}</span>
      </div>
      {owner && <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#666" }}>{short(owner)}</div>}
      {attestationCount > 0 && <div style={{ color:"#35D07F", fontSize:12, marginTop:8, fontFamily:"Space Mono, monospace" }}>✓ {attestationCount} attestation{attestationCount!==1?"s":""}</div>}
      {txHash && <a href={`${CELO_EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ display:"block", marginTop:12, color:"#35D07F", fontFamily:"Space Mono, monospace", fontSize:11, textDecoration:"none" }}>View on Celoscan ↗</a>}
    </div>
  );
}