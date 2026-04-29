"use client";

export default function VerifiedBadge({ compact = false }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
      border: "2px solid #00ff8844", background: "#00ff8808",
      padding: compact ? "3px 8px" : "5px 12px" }}>
      <span style={{ color: "#00ff88", fontSize: compact ? 10 : 12,
        lineHeight: 1 }}>✓</span>
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 8 : 10, color: "#00ff88",
        letterSpacing: 1 }}>VERIFIED ON-CHAIN</span>
    </div>
  );
}