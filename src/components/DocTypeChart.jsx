"use client";
import { useDocTypes } from "@/hooks/useDocTypes";
import { DOC_TYPES } from "@/lib/constants";

function getColor(type) {
  return DOC_TYPES.find(d => d.value === type)?.color || "#555";
}

export default function DocTypeChart() {
  const { withPct, total, loading } = useDocTypes();
  if (loading || !total) return null;

  const R = 48; const CX = 56; const CY = 56;
  let cumPct = 0;

  function slice(pct, startPct) {
    if (pct === 0) return null;
    const r     = (startPct / 100) * 2 * Math.PI - Math.PI / 2;
    const rEnd  = ((startPct + pct) / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = CX + R * Math.cos(r);
    const y1 = CY + R * Math.sin(r);
    const x2 = CX + R * Math.cos(rEnd);
    const y2 = CY + R * Math.sin(rEnd);
    const large = pct > 50 ? 1 : 0;
    return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <div>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
        DOCUMENT TYPES
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <svg width={112} height={112} viewBox="0 0 112 112">
          {withPct.map(t => {
            const path = slice(t.pct, cumPct);
            cumPct += t.pct;
            return path ? (
              <path key={t.doc_type} d={path}
                fill={getColor(t.doc_type)} fillOpacity={0.8} />
            ) : null;
          })}
          <circle cx={CX} cy={CY} r={24} fill="#0a0a0a" />
          <text x={CX} y={CY + 4} textAnchor="middle"
            fontFamily="Archivo Black, sans-serif" fontSize={11} fill="#f5f0e8">
            {total}
          </text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {withPct.map(t => (
            <div key={t.doc_type} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 8, height: 8, background: getColor(t.doc_type), flexShrink: 0 }} />
              <span style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 8, color: "#888", letterSpacing: 1, minWidth: 70 }}>
                {t.doc_type?.toUpperCase()}
              </span>
              <span style={{ fontFamily: "Space Mono, monospace",
                fontSize: 8, color: "#555" }}>{t.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}