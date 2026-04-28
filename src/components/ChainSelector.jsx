"use client";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";
import ChainIcon from "./ChainIcon";

export default function ChainSelector() {
  const { network, networks, switchTo } = useNetworkSwitch();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {networks.map(n => {
        const active = n.id === network?.id;
        const color  = n.id === "celo" ? "#FCFF52" : "#F7931A";
        return (
          <label key={n.id}
            style={{ display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", padding: "10px 14px",
              border: `2px solid ${active ? color : "#1a1a1a"}`,
              background: active ? `${color}08` : "transparent",
              transition: "all 0.1s" }}>
            <input type="radio" name="chain" value={n.id}
              checked={active} onChange={() => switchTo(n.id)}
              style={{ display: "none" }} />
            <ChainIcon chain={n.id} size={16} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 11, color: active ? color : "#888",
                letterSpacing: 1 }}>
                {n.label?.toUpperCase()}
              </div>
              <div style={{ fontFamily: "Space Mono, monospace",
                fontSize: 8, color: "#444", marginTop: 1 }}>
                {n.id === "stacks" ? "Bitcoin L2 · ~10min" : "EVM · ~5sec"}
              </div>
            </div>
            {active && (
              <span style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 7, color, letterSpacing: 1,
                border: `1px solid ${color}44`, padding: "2px 6px" }}>
                SELECTED
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}