"use client";
import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "@/context/WalletContext";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useReputation(address_) {
  const { address: ctxAddr } = useWalletContext();
  const address = address_ || ctxAddr;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!address || !VERIFIER_API) return;
    setLoading(true);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/reputation/${address}`);
      if (!res.ok) return;
      setData(await res.json());
    } catch {}
    setLoading(false);
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return {
    data, loading, refresh: fetch_,
    score:        data?.score         ?? 0,
    anchorCount:  data?.anchor_count  ?? 0,
    attestCount:  data?.attest_count  ?? 0,
    slashCount:   data?.slash_count   ?? 0,
  };
}