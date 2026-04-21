"use client";
import { getReputationTier } from "@/hooks/useReputation";

export default function ReputationBadge({ score = 0, showScore = false }) {
  const tier = getReputationTier(score);
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6,
      border:`2px solid ${tier.color}`, padding:"3px 10px" }}>
      <div style={{ width:6, height:6, borderRadius:"50%",
        background:tier.color }} />
      <span style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:9, color:tier.color, letterSpacing:1 }}>
        {tier.label}
      </span>
      {showScore && (
        <span style={{ fontFamily:"Space Mono, monospace",
          fontSize:9, color:tier.color }}>
          {score}
        </span>
      )}
    </div>
  );
}