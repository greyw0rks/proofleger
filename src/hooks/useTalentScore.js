"use client";
import { useState, useEffect } from "react";
import { getBuilderScore } from "@/lib/talent-protocol";
import { cacheWrap } from "@/lib/cache";

export function useTalentScore(address) {
  const [score, setScore]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    cacheWrap(`talent:${address}`, () => getBuilderScore(address), 300_000)
      .then(setScore)
      .catch(() => setScore(null))
      .finally(() => setLoading(false));
  }, [address]);

  return { score, loading };
}