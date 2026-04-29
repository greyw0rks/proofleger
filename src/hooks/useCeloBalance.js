"use client";
import { useState, useEffect, useCallback } from "react";

const CELO_RPC = "https://feth.celo.org";

export function useCeloBalance(address) {
  const [balance,  setBalance]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch(CELO_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }),
      });
      const data = await res.json();
      const wei  = BigInt(data.result || "0x0");
      setBalance((Number(wei) / 1e18).toFixed(4));
    } catch(e) { setError(e.message); }
    setLoading(false);
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { balance, loading, error, refresh: fetch_ };
}