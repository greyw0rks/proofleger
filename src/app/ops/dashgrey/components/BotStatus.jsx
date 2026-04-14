"use client";
import { useState, useEffect } from "react";

export default function BotStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch from ops API
    fetch("/api/ops/bot-status").then(r => r.json()).then(setStatus).catch(() => {});
  }, []);

  const items = [
    { label: "Scheduler", value: status?.schedulerRunning ? "RUNNING" : "STOPPED", ok: status?.schedulerRunning },
    { label: "Last Run", value: status?.lastRun || "Unknown", ok: true },
    { label: "Next Run", value: status?.nextRun || "Unknown", ok: true },
    { label: "Active Wallets", value: status?.activeWallets ?? "—", ok: (status?.activeWallets || 0) >= 30 },
    { label: "Total TXs Today", value: status?.txsToday ?? "—", ok: true },
    { label: "Runs Completed", value: status?.runsCompleted ?? "—", ok: true },
  ];

  return (
    <div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A",
        marginBottom:16, letterSpacing:1 }}>BOT STATUS</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ border:`2px solid ${item.ok ? "#333" : "#ff3333"}`, padding:"10px 14px" }}>
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#666", marginBottom:4 }}>{item.label}</div>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
              color: item.ok ? "#f5f0e8" : "#ff3333" }}>{String(item.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}