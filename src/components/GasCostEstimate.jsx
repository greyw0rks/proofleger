"use client";
import { useEffect } from "react";
import { useCeloGas } from "@/hooks/useCeloGas";

export default function GasCostEstimate({ show = true }) {
  const { gasPrice, estimatedCost, loading, estimate } = useCeloGas();

  useEffect(() => { if (show) estimate(); }, [show]);

  if (!show || loading) return null;
  if (!estimatedCost) return null;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
      background:"#0d1f16", border:"2px solid #35D07F",
      fontFamily:"Space Mono, monospace", fontSize:10 }}>
      <span style={{ color:"#35D07F" }}>⛽</span>
      <span style={{ color:"#888" }}>Est. gas: ~{estimatedCost.toFixed(6)} CELO</span>
      <span style={{ color:"#555" }}>(sub-cent)</span>
    </div>
  );
}