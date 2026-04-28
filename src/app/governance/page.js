"use client";
import GovernancePanel from "@/components/GovernancePanel";
import StatsStrip      from "@/components/StatsStrip";

export default function GovernancePage() {
  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 26, marginBottom: 4 }}>GOVERNANCE</h1>
          <p style={{ color: "#888", fontSize: 13 }}>
            Stake-weighted protocol proposals
          </p>
        </div>
        <GovernancePanel />
      </div>
    </div>
  );
}