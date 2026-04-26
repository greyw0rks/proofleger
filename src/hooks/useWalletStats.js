"use client";
import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "@/context/WalletContext";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useWalletStats(address_) {
  const { address: ctxAddress } = useWalletContext();
  const address = address_ || ctxAddress;

  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/wallet/${address}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { stats, loading, error, refresh: fetch_,
    stacksCount: stats?.stacks?.length ?? 0,
    celoCount:   stats?.celo?.length   ?? 0,
    total:       stats?.total           ?? 0 };
}