"use client";
import { useTalentScore } from "@/hooks/useTalentScore";

export default function TalentBadge({ address, compact = false }) {
  const { score, isVerified, loading } = useTalentScore(address);

  if (loading || !isVerified) return null;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
      border: "2px solid #38bdf844", background: "#38bdf808",
      padding: compact ? "3px 8px" : "5px 12px" }}>
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 7 : 9, color: "#38bdf8",
        letterSpacing: 1 }}>TALENT</span>
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 10 : 13, color: "#38bdf8" }}>
        {score}
      </span>
    </div>
  );
}