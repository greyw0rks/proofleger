"use client";

export default function StatCard({ label, value, sub = null, color = "#F7931A", trend = null }) {
  const trendColor = trend > 0 ? "#00ff88" : trend < 0 ? "#ff3333" : "#555";

  return (
    <div style={{ border: "2px solid #1a1a1a", padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 28, color, fontVariantNumeric: "tabular-nums" }}>
          {value ?? "—"}
        </span>
        {trend !== null && (
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 9, color: trendColor }}>
            {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "—"}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontFamily: "Space Mono, monospace",
          fontSize: 9, color: "#444" }}>{sub}</div>
      )}
    </div>
  );
}