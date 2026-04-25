"use client";
import { useNetworkContext } from "@/context/NetworkContext";

const CHAIN_COLORS = {
  stacks: "#F7931A",
  celo:   "#FCFF52",
};

export default function NetworkBadge({ compact = false }) {
  const { network } = useNetworkContext();
  const color = CHAIN_COLORS[network?.id] || "#555";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
      border: `2px solid ${color}20`, background: `${color}08`,
      padding: compact ? "3px 8px" : "5px 12px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%",
        background: color, flexShrink: 0, boxShadow: `0 0 4px ${color}` }} />
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 8 : 10, color, letterSpacing: 1 }}>
        {network?.label?.toUpperCase() || "NO NETWORK"}
      </span>
    </div>
  );
}