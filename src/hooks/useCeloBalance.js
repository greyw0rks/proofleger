"use client";
import { useState, useEffect, useCallback } from "react";
import { CELO_RPC } from "@/lib/wallet-celo";
export function useCeloBalance(address) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(CELO_RPC, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc:"2.0", method:"eth_getBalance", params:[address,"latest"], id:1 }),
      });
      const data = await res.json();
      const wei = BigInt(data.result || "0");
      setBalance(Number(wei) / 1e18);
    } catch {}
    finally { setLoading(false); }
  }, [address]);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { balance, loading, refetch: fetch_ };
}