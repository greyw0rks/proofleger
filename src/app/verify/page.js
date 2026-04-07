"use client";
import { useState } from "react";
import { verifyDocument } from "@/lib/wallet";
export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleVerify() {
    if (!hash.trim()) return;
    setLoading(true); setResult(null);
    try { const r = await verifyDocument(hash.trim()); setResult(r || "not_found"); }
    catch { setResult("error"); }
    finally { setLoading(false); }
  }
  return (
    <div style={{ maxWidth:640, margin:"80px auto", padding:"0 24px", fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:24 }}>VERIFY DOCUMENT</h1>
      <input value={hash} onChange={e=>setHash(e.target.value)} placeholder="Enter SHA-256 hash..."
        style={{ width:"100%", background:"transparent", border:"3px solid #f5f0e8", color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace", fontSize:13, outline:"none", marginBottom:16 }} />
      <button onClick={handleVerify} disabled={loading}
        style={{ width:"100%", background:"#F7931A", border:"3px solid #F7931A", color:"#000", padding:14, fontFamily:"Archivo Black, sans-serif", fontSize:14, cursor:"pointer" }}>
        {loading ? "VERIFYING..." : "VERIFY ON BITCOIN"}
      </button>
      {result && result !== "not_found" && result !== "error" && (
        <div style={{ border:"3px solid #00ff88", padding:16, marginTop:20, color:"#00ff88", fontFamily:"Space Mono, monospace", fontSize:12 }}>
          ✓ VERIFIED — anchored at block #{result["block-height"] || result.blockHeight}
        </div>
      )}
      {result === "not_found" && <div style={{ border:"3px solid #ff3333", padding:16, marginTop:20, color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:12 }}>✗ NOT FOUND on chain</div>}
    </div>
  );
}
