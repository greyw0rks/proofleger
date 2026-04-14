"use client";
import { useState, useEffect } from "react";

export default function WalletPool() {
  const [pool, setPool] = useState(null);

  useEffect(() => {
    fetch("/api/ops/wallet-pool").then(r => r.json()).then(setPool).catch(() => {});
  }, []);

  const active = pool?.active || 0;
  const depleted = pool?.depleted || 0;
  const total = active + depleted;
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A",
        marginBottom:16, letterSpacing:1 }}>WALLET POOL</div>
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Space Mono, monospace",
          fontSize:10, color:"#888", marginBottom:6 }}>
          <span>{active} ACTIVE</span><span>{depleted} DEPLETED</span>
        </div>
        <div style={{ height:8, background:"#222", border:"2px solid #333" }}>
          <div style={{ height:"100%", background:"#00ff88", width:`${pct}%`, transition:"width 0.3s" }} />
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#555", marginTop:4 }}>
          {pct}% funded · {total} total wallets
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[["FIRST 100", pool?.first100Active||0, "#F7931A"],
          ["LAST 60", pool?.last60Active||0, "#a78bfa"],
          ["AGENT BAL", pool?.agentBalance ? `${pool.agentBalance.toFixed(2)} STX` : "—", "#38bdf8"]
        ].map(([label, val, color], i) => (
          <div key={i} style={{ border:`2px solid ${color}`, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color }}>{val}</div>
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:8, color:"#666", marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}