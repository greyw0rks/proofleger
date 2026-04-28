"use client";
import { useWalletContext } from "@/context/WalletContext";
import { shortAddress } from "@/utils/format";

export default function WalletConnect({ compact = false }) {
  const { address, isConnected, connect, disconnect } = useWalletContext();

  if (isConnected) return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ border: "2px solid #1a1a1a", padding: compact ? "4px 10px" : "6px 14px",
        display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%",
          background: "#00ff88", flexShrink: 0 }} />
        <span style={{ fontFamily: "Space Mono, monospace",
          fontSize: compact ? 8 : 9, color: "#888" }}>
          {shortAddress(address)}
        </span>
      </div>
      <button onClick={disconnect}
        style={{ border: "2px solid #1a1a1a", background: "transparent",
          color: "#555", padding: compact ? "4px 8px" : "6px 12px",
          fontFamily: "Archivo Black, sans-serif", fontSize: 8,
          cursor: "pointer", letterSpacing: 1 }}>
        DISCONNECT
      </button>
    </div>
  );

  return (
    <button onClick={connect}
      style={{ border: "2px solid #F7931A", background: "transparent",
        color: "#F7931A", padding: compact ? "6px 14px" : "9px 20px",
        fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 9 : 10, cursor: "pointer", letterSpacing: 1 }}>
      CONNECT WALLET
    </button>
  );
}