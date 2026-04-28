"use client";
import { useState } from "react";
import { useTimeline } from "@/hooks/useTimeline";

export default function TimelineChart({ days = 30 }) {
  const { data, loading, maxAnchors } = useTimeline(days);
  const [hovered, setHovered] = useState(null);

  if (loading || !data.length) return null;

  const W = 640; const H = 80; const PAD = 4;
  const barW = Math.max(4, Math.floor((W - PAD * (days - 1)) / days));

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 10 }}>
        30-DAY ACTIVITY
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible" }}>
        {data.slice(-days).map((d, i) => {
          const barH = Math.max(2, Math.round((d.anchors / maxAnchors) * H));
          const x    = i * (barW + PAD);
          const isHov = hovered === i;
          return (
            <g key={d.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}>
              <rect x={x} y={H - barH} width={barW} height={barH}
                fill={isHov ? "#F7931A" : "#F7931A55"} rx={1} />
              {isHov && (
                <g>
                  <rect x={Math.min(x, W - 90)} y={H - barH - 32}
                    width={88} height={26} fill="#1a1a1a" />
                  <text x={Math.min(x, W - 90) + 4} y={H - barH - 20}
                    fontFamily="Space Mono, monospace" fontSize={7} fill="#F7931A">
                    {d.date}
                  </text>
                  <text x={Math.min(x, W - 90) + 4} y={H - barH - 10}
                    fontFamily="Archivo Black, monospace" fontSize={8} fill="#f5f0e8">
                    {d.anchors} anchors
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}