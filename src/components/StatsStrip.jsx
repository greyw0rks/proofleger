"use client";
import { useState, useEffect } from "react";
import { usePolling } from "@/hooks/usePolling";
import LiveCounter from "./LiveCounter";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function StatsStrip() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    if (!VERIFIER_API) return;
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/stats`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);
  usePolling(fetchStats, 30_000);

  if (!stats) return null;

  const items = [
    { label: "ANCHORS",   value: stats.stacks?.total_anchors  ?? 0 },
    { label: "ATTESTS",   value: stats.stacks?.total_attests  ?? 0 },
    { label: "WALLETS",   value: stats.stacks?.total_senders  ?? 0 },
    { label: "CELO TXS",  value: stats.celo?.total            ?? 0 },
  ];

  return (
    <div style={{ borderBottom: "1px solid #111", padding: "8px 24px",
      display: "flex", gap: 32, overflowX: "auto" }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 8, color: "#444", letterSpacing: 1 }}>{label}</span>
          <LiveCounter value={value} size={14} />
        </div>
      ))}
    </div>
  );
}