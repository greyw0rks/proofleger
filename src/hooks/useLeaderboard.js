"use client";
import { useState, useEffect, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useLeaderboard(type = "anchors", limit = 10) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const path = type === "reputation"
    ? `/v2/leaderboard/reputation?limit=${limit}`
    : type === "staking"
    ? `/v2/leaderboard/staking?limit=${limit}`
    : `/v2/leaderboard?limit=${limit}`;

  const fetch_ = useCallback(async () => {
    if (!VERIFIER_API) { setLoading(false); return; }
    try {
      const res  = await fetch(VERIFIER_API + path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }, [path]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refresh: fetch_,
    entries: data?.leaderboard ?? [] };
}