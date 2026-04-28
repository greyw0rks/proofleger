"use client";
import { useGovernance } from "@/hooks/useGovernance";
import Spinner from "./Spinner";

function VoteBar({ votesFor = 0, votesAgainst = 0 }) {
  const total = votesFor + votesAgainst;
  const pct   = total > 0 ? Math.round((votesFor / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        fontFamily: "Space Mono, monospace", fontSize: 7,
        color: "#555", marginBottom: 3 }}>
        <span style={{ color: "#00ff88" }}>FOR {votesFor}</span>
        <span style={{ color: "#ff3333" }}>AGAINST {votesAgainst}</span>
      </div>
      <div style={{ height: 3, background: "#1a1a1a", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0,
          height: "100%", width: `${pct}%`,
          background: pct >= 60 ? "#00ff88" : "#F7931A",
          transition: "width 0.3s" }} />
        <div style={{ position: "absolute", left: "60%", top: -1,
          width: 1, height: 5, background: "#333" }} />
      </div>
    </div>
  );
}

export default function GovernancePanel() {
  const { proposals, stats, loading } = useGovernance();

  if (loading) return <div style={{ padding: 24, textAlign: "center" }}><Spinner size={18} /></div>;

  return (
    <div>
      {stats && (
        <div style={{ display: "flex", gap: 20, marginBottom: 16,
          fontFamily: "Space Mono, monospace", fontSize: 9 }}>
          <span style={{ color: "#555" }}>ACTIVE <span style={{ color: "#F7931A" }}>{stats.active}</span></span>
          <span style={{ color: "#555" }}>PASSED <span style={{ color: "#00ff88" }}>{stats.passed}</span></span>
          <span style={{ color: "#555" }}>VOTERS <span style={{ color: "#888" }}>{stats.voters}</span></span>
        </div>
      )}
      {!proposals.length ? (
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10,
          color: "#2a2a2a", padding: "20px 0" }}>No active proposals</div>
      ) : proposals.map(p => (
        <div key={p.proposal_id}
          style={{ borderBottom: "1px solid #0f0f0f", padding: "14px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 11, color: "#f5f0e8", flex: 1, marginRight: 12 }}>
              {p.title}
            </div>
            <span style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 7,
              letterSpacing: 1, padding: "3px 6px",
              border: `1px solid ${p.executed ? (p.passed ? "#00ff8844" : "#ff333344") : "#333"}`,
              color: p.executed ? (p.passed ? "#00ff88" : "#ff3333") : "#555",
              flexShrink: 0 }}>
              {p.executed ? (p.passed ? "PASSED" : "FAILED") : "OPEN"}
            </span>
          </div>
          <VoteBar votesFor={p.votes_for} votesAgainst={p.votes_against} />
        </div>
      ))}
    </div>
  );
}