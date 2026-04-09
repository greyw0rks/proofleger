"use client";
import { CELO_EXPLORER } from "@/lib/wallet-celo";
export default function CeloTxLink({ txHash, label }) {
  if (!txHash) return null;
  return (
    <a href={`${CELO_EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer"
      style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#35D07F", textDecoration:"none" }}>
      {label || `${txHash.slice(0,10)}...`} ↗
    </a>
  );
}