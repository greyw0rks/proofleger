"use client";
import { useState, useEffect } from "react";
export default function ExplorePage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://api.hiro.so/extended/v1/address/SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3/transactions?limit=20")
      .then(r => r.json()).then(d => { setDocs(d.results || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 24px", fontFamily:"Space Grotesk, sans-serif", background:"#0a0a0a", minHeight:"100vh", color:"#f5f0e8" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:32, marginBottom:8 }}>EXPLORE</h1>
      <p style={{ color:"#888", marginBottom:32 }}>{loading ? "Loading..." : `${docs.length} recent proofs on Bitcoin`}</p>
      {docs.map((tx,i) => (
        <div key={i} style={{ border:"3px solid #f5f0e8", padding:16, marginBottom:12, boxShadow:"4px 4px 0 #f5f0e8" }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>{tx.sender_address?.slice(0,16)}...</div>
          <div style={{ fontSize:12, color:"#666", marginTop:4 }}>Block #{tx.block_height} · {tx.contract_call?.function_name}</div>
        </div>
      ))}
    </div>
  );
}
