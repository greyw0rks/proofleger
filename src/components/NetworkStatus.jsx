"use client";
import { useNetwork } from "@/hooks/useNetwork";
import { useCeloStats } from "@/hooks/useCeloStats";

export default function NetworkStatus({ compact = true }) {
  const { blockHeight, loading: stacksLoading } = useNetwork();
  const { blockHeight: celoBlock, loading: celoLoading } = useCeloStats();

  const networks = [
    { label:"Stacks", color:"#F7931A", value: blockHeight, loading: stacksLoading },
    { label:"Celo",   color:"#35D07F", value: celoBlock,   loading: celoLoading   },
  ];

  if (compact) return (
    <div style={{ display:"flex", gap:12 }}>
      {networks.map(n => (
        <div key={n.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:5, height:5, borderRadius:"50%",
            background: n.loading ? "#444" : n.color,
            boxShadow: !n.loading ? `0 0 5px ${n.color}` : "none" }} />
          <span style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#555" }}>
            {n.loading ? "..." : `#${Number(n.value || 0).toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:"flex", gap:16 }}>
      {networks.map(n => (
        <div key={n.label} style={{ border:`2px solid ${n.color}22`, padding:"8px 14px" }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:8,
            color:"#555", marginBottom:4, letterSpacing:1 }}>
            {n.label.toUpperCase()}
          </div>
          <div style={{ fontFamily:"Archivo Black, sans-serif",
            fontSize:14, color:n.color }}>
            {n.loading ? "..." : `#${Number(n.value || 0).toLocaleString()}`}
          </div>
        </div>
      ))}
    </div>
  );
}