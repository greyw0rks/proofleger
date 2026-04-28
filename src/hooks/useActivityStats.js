"use client";
import { useState, useEffect } from "react";
import { usePolling } from "@/hooks/usePolling";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useActivityStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetch_() {
    if (!VERIFIER_API) { setLoading(false); return; }
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/stats`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetch_(); }, []);
  usePolling(fetch_, 60_000);

  return {
    stats, loading,
    stacksAnchors: stats?.stacks?.total_anchors  ?? 0,
    stacksAttests: stats?.stacks?.total_attests  ?? 0,
    stacksWallets: stats?.stacks?.total_senders  ?? 0,
    celoTotal:     stats?.celo?.total            ?? 0,
    celoWallets:   stats?.celo?.wallets          ?? 0,
    combined:      (stats?.stacks?.total_anchors ?? 0) +
                   (stats?.stacks?.total_attests ?? 0) +
                   (stats?.celo?.total           ?? 0),
  };
}