'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_VERIFIER_API;

export function useCertification(proofHash) {
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    if (!proofHash) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v2/certifications/${proofHash}`);
      if (res.status === 404) { setCertification(null); return; }
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setCertification(data.certification ?? null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [proofHash]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const tierColor = {
    platinum: '#a78bfa', gold: '#FCFF52',
    audited: '#F7931A', verified: '#00ff88', standard: '#888',
  };

  const color = certification ? (tierColor[certification.tier] ?? '#888') : null;

  return { certification, loading, error, color, refetch: fetch_ };
}
