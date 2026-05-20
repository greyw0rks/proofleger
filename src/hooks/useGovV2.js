import { useState, useEffect, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useGovV2() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/v2/gov2/proposals`);
      setProposals((await r.json()).proposals ?? []);
    } catch (_) {} finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch_(); const t = setInterval(fetch_, 60000); return () => clearInterval(t); }, [fetch_]);
  const active = proposals.filter(p => !p.executed);
  const executed = proposals.filter(p => p.executed);
  return { proposals, active, executed, loading, refetch: fetch_ };
}