import { useState, useEffect, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useCredentials(address, { type = "holder", chain = "stacks" } = {}) {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const r = await fetch(`${API}/v2/cred-index/${address}?type=${type}&chain=${chain}`);
      if (!r.ok) throw new Error("Failed");
      setCredentials((await r.json()).credentials ?? []);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [address, type, chain]);
  useEffect(() => { fetch_(); }, [fetch_]);
  const bySchema = credentials.reduce((acc, c) => { const k = c.schema ?? "other"; acc[k] = [...(acc[k] ?? []), c]; return acc; }, {});
  return { credentials, bySchema, loading, error, refetch: fetch_ };
}