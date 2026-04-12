"use client";
import { useState, useEffect } from "react";
import { getCeloDocumentCount } from "@/lib/celo-events";

export function useCeloDocCount(address) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getCeloDocumentCount(address)
      .then(setCount)
      .catch(() => setCount(0))
      .finally(() => setLoading(false));
  }, [address]);

  return { count, loading };
}