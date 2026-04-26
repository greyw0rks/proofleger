"use client";
import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function StakingWidget() {
  const { address, isConnected } = useWalletContext();
  const [stake,   setStake]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !VERIFIER_API) return;
    setLoading(true);
    fetch(`${VERIFIER_API}/v2/stake/${address}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setStake(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [address]);

  if (!isConnected || loading) return null;

  return (
    <div style={{ border: "2px solid #1a1a1a", padding: "14px 18px",
      fontFamily: "Space Grotesk, sans-serif" }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 10 }}>
        STAKING
      </div>
      {stake?.amount_ustx ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 22, color: "#F7931A" }}>
              {(stake.amount_ustx / 1_000_000).toFixed(2)} STX
            </div>
            <div style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#555", marginTop: 2 }}>
              {stake.weight} governance weight
            </div>
          </div>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 8, letterSpacing: 1,
            color: stake.active ? "#00ff88" : "#555",
            border: `1px solid ${stake.active ? "#00ff8844" : "#333"}`,
            padding: "4px 8px" }}>
            {stake.active ? "STAKED" : "UNSTAKED"}
          </div>
        </div>
      ) : (
        <div style={{ fontFamily: "Space Mono, monospace",
          fontSize: 10, color: "#333" }}>No active stake</div>
      )}
    </div>
  );
}