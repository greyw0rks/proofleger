"use client";
import { useState, useCallback, useRef } from "react";

export function useContractCall(callFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());

  const call = useCallback(async (...args) => {
    const key = JSON.stringify(args);
    if (cache.current.has(key)) {
      setData(cache.current.get(key));
      return cache.current.get(key);
    }
    setLoading(true); setError(null);
    try {
      const result = await callFn(...args);
      cache.current.set(key, result);
      setData(result);
      return result;
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [callFn]);

  return { call, data, loading, error, clearCache: () => cache.current.clear() };
}