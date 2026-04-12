"use client";
import { useState, useEffect, useCallback } from "react";
import { getRecentCeloAnchors } from "@/lib/celo-events";

export function useCeloEvents(autoRefresh = true) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRecentCeloAnchors();
      setEvents(result);
      setLastUpdate(new Date());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch_();
    if (!autoRefresh) return;
    const interval = setInterval(fetch_, 30_000);
    return () => clearInterval(interval);
  }, [fetch_, autoRefresh]);

  return { events, loading, lastUpdate, refresh: fetch_ };
}