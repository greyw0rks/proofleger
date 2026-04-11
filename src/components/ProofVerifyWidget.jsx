"use client";
import { useState } from "react";
import { verifyDocument } from "@/lib/wallet";
export default function ProofVerifyWidget({ initialHash = "", compact = false }) {
  const [hash, setHash] = useState(initialHash);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  async function verify() {
    if (!hash.trim()) return;
    setLoading(true);
    const r = await verifyDocument(hash.trim()).catch(() => null);
    setResult(r); setLoading(false);
  }
  const verified = result && result !== "not_found";
  return (
    <div style={{ border:"3px solid #f5f0e8", padding:compact?12:24, background:"#0a0a0a", fontFamily:"Space Grotesk, sans-serif", maxWidth:compact?320:480 }}>
      {!compact && <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A", marginBottom:12, letterSpacing:1 }}>VERIFY DOCUMENT</div>}
      <div style={{ display:"flex", gap:8 }}>
        <input value={hash} onChange={e=>setHash(e.target.value)} placeholder="SHA-256 hash..."
          style={{ flex:1, background:"transparent", border:"2px solid #333", color:"#f5f0e8", padding:"8px 10px", fontFamily:"Space Mono, monospace", fontSize:11, outline:"none" }} />
        <button onClick={verify} disabled={loading}
          style={{ background:"#F7931A", border:"none", color:"#000", padding:"8px 14px", fontFamily:"Archivo Black, sans-serif", fontSize:11, cursor:"pointer" }}>
          {loading?"...":"VERIFY"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop:8, fontSize:11, fontFamily:"Space Mono, monospace", color:verified?"#00ff88":"#ff3333" }}>
          {verified ? `✓ ANCHORED — Block #${result["block-height"]||result.blockHeight}` : "✗ NOT FOUND"}
        </div>
      )}
    </div>
  );
}