"use client";
import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "@/context/WalletContext";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useStaking(address_) {
  const { address: ctxAddr } = useWalletContext();
  const address = address_ || ctxAddr;

  const [stake,   setStake]   = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!address || !VERIFIER_API) return;
    setLoading(true);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/stake/${address}`);
      if (!res.ok) return;
      setStake(await res.json());
    } catch {}
    setLoading(false);
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return {
    stake, loading, refresh: fetch_,
    isStaked:    stake?.active      === true,
    weight:      stake?.weight      ?? 0,
    amountUstx:  stake?.amount_ustx ?? 0,
    amountStx:   ((stake?.amount_ustx ?? 0) / 1_000_000).toFixed(2),
  };
}