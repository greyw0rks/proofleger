"use client";
import { useState, useCallback } from "react";

const CELO_RPC = "https://feth.celo.org";

export function useCeloGas() {
  const [gasPrice, setGasPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const estimate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(CELO_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 }),
      });
      const data = await res.json();
      const gwei = parseInt(data.result, 16) / 1e9;
      setGasPrice(gwei);
      return gwei;
    } catch { return null; }
    finally { setLoading(false); }
  }, []);

  // Estimate cost for a typical anchor tx (~100k gas)
  const estimatedCost = gasPrice ? (gasPrice * 100000) / 1e9 : null;

  return { gasPrice, estimatedCost, loading, estimate };
}