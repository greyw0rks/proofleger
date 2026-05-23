// generated: may22  hook: ReputationHistory
// fetch reputation change history
import { useState, useEffect, useCallback } from 'react';
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useReputationHistory(arg) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetch_ = useCallback(async () => {
    if (!arg) return;
    setLoading(true); setError(null);
    try {
      const r = await fetch(API + '/v2/' + String(arg));
      if (!r.ok) throw new Error('Fetch failed ' + r.status);
      setData(await r.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [arg]);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { data, loading, error, refetch: fetch_ };
}
