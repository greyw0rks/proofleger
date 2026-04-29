"use client";
import { useState, useEffect } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useDocTypes() {
  const [types,   setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!VERIFIER_API) { setLoading(false); return; }
    fetch(`${VERIFIER_API}/v2/leaderboard`)
      .then(r => r.ok ? r.json() : { topDocTypes: [] })
      .then(d => { setTypes(d.topDocTypes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = types.reduce((s, t) => s + (t.count || 0), 0);

  return {
    types, loading, total,
    withPct: types.map(t => ({
      ...t,
      pct: total > 0 ? Math.round((t.count / total) * 100) : 0,
    })),
  };
}