"use client";
import { useState, useEffect } from "react";
import { collectProtocolStats, getActiveWallets } from "@/lib/analytics-collector";
import { cacheWrap } from "@/lib/cache";

export function useAnalytics() {
  const [stats, setStats] = useState(null);
  const [activeWallets, setActiveWallets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          cacheWrap("analytics:stats", collectProtocolStats, 120_000),
          cacheWrap("analytics:wallets", () => getActiveWallets(7), 120_000),
        ]);
        setStats(s);
        setActiveWallets(a);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return { stats, activeWallets, loading };
}