"use client";
import { useState, useEffect } from "react";
import { buildLeaderboard } from "@/lib/leaderboard-builder";
import { cacheWrap } from "@/lib/cache";

export function useLeaderboard(limit = 20) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cacheWrap(`leaderboard:${limit}`, () => buildLeaderboard(limit), 300_000)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { entries, loading };
}