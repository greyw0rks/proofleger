"use client";
import { useTalentScore } from "@/hooks/useTalentScore";
import { getScoreTier } from "@/lib/talent-protocol";

export default function TalentBadge({ address, compact = false }) {
  const { score, loading } = useTalentScore(address);
  if (loading) return (
    <div style={{ border:"2px solid #222", padding:"3px 10px",
      fontFamily:"Space Mono, monospace", fontSize:9, color:"#444" }}>
      TALENT...
    </div>
  );
  if (!score) return null;
  const tier = getScoreTier(score.score);
  return (
    <div style={{ border:`2px solid ${tier.color}`, padding: compact ? "3px 10px" : "8px 16px",
      display:"inline-flex", alignItems:"center", gap:8 }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:tier.color }} />
      {!compact && (
        <div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:8,
            color:"#555", letterSpacing:1 }}>TALENT PROTOCOL</div>
          <div style={{ fontFamily:"Archivo Black, sans-serif",
            fontSize:11, color:tier.color }}>{tier.label}</div>
        </div>
      )}
      <div style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize: compact ? 12 : 20, color:tier.color }}>
        {score.score}
      </div>
    </div>
  );
}