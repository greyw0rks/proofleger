"use client";
import { useActivityStats } from "@/hooks/useActivityStats";
import LiveCounter from "./LiveCounter";
import ChainIcon   from "./ChainIcon";

export default function ProtocolStats() {
  const { stacksAnchors, stacksWallets, celoTotal, celoWallets, combined, loading } = useActivityStats();

  const items = [
    { label: "TOTAL PROOFS",   value: combined,       color: "#F7931A", icon: null },
    { label: "STACKS ANCHORS", value: stacksAnchors,  color: "#F7931A", chain: "stacks" },
    { label: "STACKS WALLETS", value: stacksWallets,  color: "#888",    chain: "stacks" },
    { label: "CELO TXS",       value: celoTotal,      color: "#FCFF52", chain: "celo" },
    { label: "CELO WALLETS",   value: celoWallets,    color: "#FCFF5288", chain: "celo" },
  ];

  return (
    <div style={{ display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1,
      background: "#111", border: "1px solid #111" }}>
      {items.map(({ label, value, color, chain }) => (
        <div key={label} style={{ background: "#0a0a0a", padding: "18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {chain && <ChainIcon chain={chain} size={12} />}
            <span style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 8, color: "#555", letterSpacing: 2 }}>{label}</span>
          </div>
          <LiveCounter value={loading ? 0 : value} color={color} size={24} />
        </div>
      ))}
    </div>
  );
}