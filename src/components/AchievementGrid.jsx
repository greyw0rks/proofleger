"use client";
import { useAchievements } from "@/hooks/useAchievements";
import Spinner from "./Spinner";

const ICONS = {
  anchor: "⚓",
  attest: "✍",
  verify: "🔍",
  stake:  "🔒",
};

export default function AchievementGrid({ address }) {
  const { achievements, loading, count } = useAchievements(address);

  if (loading) return <div style={{ padding: 20, textAlign: "center" }}><Spinner size={18} /></div>;
  if (!count)  return (
    <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10,
      color: "#2a2a2a", padding: "16px 0" }}>No achievements yet</div>
  );

  return (
    <div>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
        ACHIEVEMENTS ({count})
      </div>
      <div style={{ display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
        {achievements.map(a => (
          <div key={a.achievement_id}
            style={{ border: "2px solid #F7931A22", background: "#F7931A08",
              padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 20, lineHeight: 1 }}>
              {ICONS[a.action_type] || "🏅"}
            </div>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 9, color: "#F7931A", letterSpacing: 1 }}>
              {a.name?.toUpperCase()}
            </div>
            <div style={{ fontFamily: "Space Mono, monospace",
              fontSize: 7, color: "#555", lineHeight: 1.4 }}>
              {a.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}