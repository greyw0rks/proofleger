import { useState, useEffect, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useMarketplace({ limit = 20, schema } = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit });
      if (schema) params.set("schema", schema);
      const r = await fetch(`${API}/v2/marketplace/listings?${params}`);
      setListings((await r.json()).listings ?? []);
    } catch (_) {} finally { setLoading(false); }
  }, [limit, schema]);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { listings, loading, refetch: fetch_ };
}