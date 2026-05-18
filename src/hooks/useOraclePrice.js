'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_VERIFIER_API;
const REFRESH_MS = 60_000;

export function useOraclePrice(asset = 'STX') {
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/v2/oracle/price?asset=${asset}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setPrice(data.price_usd);
      setChange24h(data.change_24h);
      setUpdatedAt(new Date());
    } catch (_) {
      // silent — oracle may not be seeded
    } finally {
      setLoading(false);
    }
  }, [asset]);

  useEffect(() => {
    fetchPrice();
    const t = setInterval(fetchPrice, REFRESH_MS);
    return () => clearInterval(t);
  }, [fetchPrice]);

  const formatted = price != null ? `$${price.toFixed(4)}` : null;
  const trend = change24h > 0 ? 'up' : change24h < 0 ? 'down' : 'flat';

  return { price, formatted, change24h, trend, loading, updatedAt, refetch: fetchPrice };
}
