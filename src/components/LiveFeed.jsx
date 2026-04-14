"use client";
import { useState, useEffect } from "react";

const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export default function LiveFeed({ limit = 5 }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=${limit}`)
      .then(r => r.json())
      .then(d => { setTxs(d.results || []); setLoading(false); })
      .catch(() => setLoading(false));
    const interval = setInterval(() => {
      fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=${limit}`)
        .then(r => r.json()).then(d => setTxs(d.results || [])).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"0 24px 40px" }}>
      <h3 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#555",
        letterSpacing:2, marginBottom:16 }}>RECENT ANCHORS</h3>
      {loading && <div style={{ color:"#444", fontFamily:"Space Mono, monospace", fontSize:11 }}>Loading...</div>}
      {txs.filter(t => t.tx_status === "success").map((tx, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"10px 0", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555" }}>
            {tx.sender_address?.slice(0,10)}...
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#333" }}>
            Block #{tx.block_height}
          </div>
          <div style={{ width:6, height:6, background:"#00ff88", borderRadius:"50%",
            boxShadow:"0 0 4px #00ff88" }} />
        </div>
      ))}
    </div>
  );
}