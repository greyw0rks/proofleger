"use client";
import { useTimeline } from "@/hooks/useTimeline";
import SkeletonLine    from "./SkeletonLine";

export default function ActivityChart({ days = 14 }) {
  const { data, loading, maxAnchors } = useTimeline(days);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
      {Array.from({ length: days }).map((_, i) => (
        <SkeletonLine key={i} width="100%" height={`${20 + Math.random() * 40}px`} />
      ))}
    </div>
  );

  if (!data.length) return null;

  const BAR_W = Math.max(8, Math.floor(520 / days) - 3);
  const H     = 60;

  return (
    <div>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 10 }}>
        DAILY ANCHORS — LAST {days} DAYS
      </div>
      <svg width="100%" viewBox={`0 0 ${days * (BAR_W + 3)} ${H + 20}`}
        style={{ overflow: "visible" }}>
        {data.slice(-days).map((d, i) => {
          const barH = Math.max(2, Math.round((d.anchors / maxAnchors) * H));
          const x    = i * (BAR_W + 3);
          const y    = H - barH;
          return (
            <g key={d.date}>
              <rect x={x} y={y} width={BAR_W} height={barH}
                fill="#F7931A" fillOpacity={0.7}
                rx={1} />
              {i % 7 === 0 && (
                <text x={x} y={H + 14}
                  fontFamily="Space Mono, monospace" fontSize={7}
                  fill="#333">{d.date?.slice(5)}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}