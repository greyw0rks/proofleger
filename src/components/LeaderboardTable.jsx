"use client";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function LeaderboardTable({ limit = 10 }) {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!VERIFIER_API) { setLoading(false); return; }
    fetch(`${VERIFIER_API}/v2/leaderboard?limit=${limit}`)
      .then(r => r.ok ? r.json() : { leaderboard: [] })
      .then(d => { setRows(d.leaderboard || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [limit]);

  if (loading) return <div style={{ padding: 24, textAlign: "center" }}><Spinner size={20} /></div>;
  if (!rows.length) return null;

  return (
    <div>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
        TOP WALLETS
      </div>
      {rows.map((row, i) => (
        <div key={row.address}
          style={{ display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid #0f0f0f", padding: "10px 0" }}>
          <span style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 11, color: i < 3 ? "#F7931A" : "#333",
            minWidth: 24 }}>#{i + 1}</span>
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 9, color: "#888", flex: 1 }}>
            {row.address?.slice(0, 8)}...{row.address?.slice(-6)}
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {[["A", row.anchors, "#F7931A"], ["T", row.attests, "#888"], ["S", row.score, "#00ff88"]].map(([k, v, c]) => (
              <div key={k} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Archivo Black, sans-serif",
                  fontSize: 11, color: c }}>{v ?? 0}</div>
                <div style={{ fontFamily: "Space Mono, monospace",
                  fontSize: 7, color: "#333" }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}