"use client";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";

const COLORS = { stacks: "#F7931A", celo: "#FCFF52" };

export default function NetworkSwitcher({ compact = false }) {
  const { network, networks, switchTo } = useNetworkSwitch();

  if (!networks.length) return null;

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {networks.map(n => {
        const active = n.id === network?.id;
        const color  = COLORS[n.id] || "#F7931A";
        return (
          <button key={n.id} onClick={() => switchTo(n.id)}
            style={{
              border: `2px solid ${active ? color : "#333"}`,
              background: active ? `${color}12` : "transparent",
              color: active ? color : "#555",
              padding: compact ? "4px 10px" : "7px 16px",
              fontFamily: "Archivo Black, sans-serif",
              fontSize: compact ? 8 : 10,
              cursor: active ? "default" : "pointer",
              letterSpacing: 1,
              transition: "all 0.1s",
            }}>
            {active && <span style={{ marginRight: 5, fontSize: 7 }}>●</span>}
            {n.label?.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}