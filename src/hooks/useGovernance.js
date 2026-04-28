"use client";
import { useState, useEffect, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useGovernance() {
  const [proposals, setProposals] = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);

  const fetch_ = useCallback(async () => {
    if (!VERIFIER_API) { setLoading(false); return; }
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/governance`);
      if (!res.ok) return;
      const data = await res.json();
      setProposals(data.proposals || []);
      setStats(data.stats || null);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { proposals, stats, loading, refresh: fetch_,
    activeCount: stats?.active ?? 0,
    passedCount: stats?.passed ?? 0 };
}