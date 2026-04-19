"use client";
import DocTypeTag from "./DocTypeTag";
import BlockBadge from "./BlockBadge";

export default function CeloVerifyResult({ result, hash }) {
  if (!result) return null;

  if (!result.exists) {
    return (
      <div style={{ border:"3px solid #ff3333", padding:24, boxShadow:"6px 6px 0 #ff3333" }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18,
          color:"#ff3333", marginBottom:8 }}>NOT FOUND ON CELO</div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#666",
          wordBreak:"break-all" }}>{hash}</div>
      </div>
    );
  }

  return (
    <div style={{ border:"3px solid #35D07F", padding:24, boxShadow:"6px 6px 0 #35D07F" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18,
        color:"#35D07F", marginBottom:16 }}>✓ VERIFIED ON CELO</div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20,
        color:"#f5f0e8", marginBottom:12 }}>{result.title || "Untitled"}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {result.docType && <DocTypeTag type={result.docType} />}
        <BlockBadge blockHeight={result.blockNumber} />
        <div style={{ border:"2px solid #35D07F", padding:"2px 8px",
          fontFamily:"Archivo Black, sans-serif", fontSize:9, color:"#35D07F",
          letterSpacing:1 }}>CELO MAINNET</div>
      </div>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:11,
        color:"#888", marginBottom:8 }}>
        Owner: {result.owner}
      </div>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
        color:"#444", wordBreak:"break-all" }}>
        Hash: {hash}
      </div>
    </div>
  );
}