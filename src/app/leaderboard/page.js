"use client";
import { useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";
import StatsStrip       from "@/components/StatsStrip";

const TABS = [
  { key: "anchors",    label: "ANCHORS"    },
  { key: "reputation", label: "REPUTATION" },
  { key: "staking",    label: "STAKING"    },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState("anchors");

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 26, marginBottom: 4 }}>LEADERBOARD</h1>
          <p style={{ color: "#888", fontSize: 13 }}>Top ProofLedger participants</p>
        </div>
        <div style={{ display: "flex", borderBottom: "2px solid #111", marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ border: "none", background: "transparent",
                borderBottom: tab === t.key ? "2px solid #F7931A" : "2px solid transparent",
                color: tab === t.key ? "#F7931A" : "#555",
                fontFamily: "Archivo Black, sans-serif", fontSize: 10,
                padding: "8px 18px", cursor: "pointer",
                letterSpacing: 1, marginBottom: -2 }}>
              {t.label}
            </button>
          ))}
        </div>
        <LeaderboardTable key={tab} limit={20} />
      </div>
    </div>
  );
}