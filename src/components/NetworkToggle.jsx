"use client";
import { useNetworkContext, NETWORKS } from "@/context/NetworkContext";

export default function NetworkToggle({ compact = false }) {
  const { network, switchNetwork } = useNetworkContext();

  return (
    <div style={{ display:"flex", border:"2px solid #222", overflow:"hidden" }}>
      {Object.values(NETWORKS).map(net => {
        const active = network.id === net.id;
        return (
          <button key={net.id} onClick={() => switchNetwork(net.id)}
            style={{ flex:1, padding: compact ? "6px 12px" : "10px 18px",
              background: active ? net.color : "transparent",
              border:"none",
              color: active ? "#000" : "#555",
              fontFamily:"Archivo Black, sans-serif",
              fontSize: compact ? 9 : 11,
              cursor:"pointer", letterSpacing:1,
              transition:"all 0.15s" }}>
            {net.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}