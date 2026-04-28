"use client";
import { useState, useEffect, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useTimeline(days = 14) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    if (!VERIFIER_API) { setLoading(false); return; }
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/timeline?days=${days}`);
      if (!res.ok) return;
      const json = await res.json();
      setData(json.timeline || []);
    } catch {}
    setLoading(false);
  }, [days]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const maxAnchors = Math.max(...data.map(d => d.anchors || 0), 1);

  return { data, loading, maxAnchors, days };
}