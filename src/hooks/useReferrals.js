import { useState, useEffect, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useReferrals(address) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/v2/referrals/${address}`);
      setStats(await r.json());
    } catch (_) {} finally { setLoading(false); }
  }, [address]);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { stats, loading, refetch: fetch_ };
}