"use client";
import { useEffect, useState } from "react";
import Badge from "./Badge";

export default function ProtocolHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("https://api.hiro.so/v2/info")
      .then(r => r.json())
      .then(d => setHealth({ ok: true, block: d.stacks_tip_height, network: "mainnet" }))
      .catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10,
      padding:"8px 14px", border:"2px solid #1a1a1a",
      fontFamily:"Space Mono, monospace", fontSize:10 }}>
      <Badge
        label={health === null ? "CHECKING" : health.ok ? "OPERATIONAL" : "DEGRADED"}
        variant={health === null ? "neutral" : health.ok ? "success" : "error"}
        dot
      />
      {health?.block && (
        <span style={{ color:"#555" }}>Block #{Number(health.block).toLocaleString()}</span>
      )}
      <span style={{ color:"#333" }}>Stacks Mainnet</span>
    </div>
  );
}