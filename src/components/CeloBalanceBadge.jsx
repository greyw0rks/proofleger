"use client";
import { useCeloBalance } from "@/hooks/useCeloBalance";

export default function CeloBalanceBadge({ address }) {
  const { balance, loading } = useCeloBalance(address);

  if (!address || loading || !balance) return null;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
      border: "1px solid #FCFF5222", background: "#FCFF5208",
      padding: "4px 10px" }}>
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 8, color: "#FCFF52", letterSpacing: 1 }}>CELO</span>
      <span style={{ fontFamily: "Space Mono, monospace",
        fontSize: 10, color: "#FCFF52" }}>{balance}</span>
    </div>
  );
}