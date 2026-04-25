"use client";
import { useState, useCallback, useEffect } from "react";
import { CACHE_KEYS } from "@/lib/constants";

export function useProofHistory(pageSize = 20) {
  const [history, setHistory]   = useState([]);
  const [page, setPage]         = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEYS.proofHistory);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const add = useCallback((entry) => {
    setHistory(prev => {
      const next = [{ ...entry, savedAt: new Date().toISOString() }, ...prev].slice(0, 200);
      try { localStorage.setItem(CACHE_KEYS.proofHistory, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((hash) => {
    setHistory(prev => {
      const next = prev.filter(e => e.hash !== hash);
      try { localStorage.setItem(CACHE_KEYS.proofHistory, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(CACHE_KEYS.proofHistory); } catch {}
  }, []);

  const page_ = history.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(history.length / pageSize);

  return {
    history: page_,
    total: history.length,
    page, totalPages,
    nextPage:  () => setPage(p => Math.min(p + 1, totalPages - 1)),
    prevPage:  () => setPage(p => Math.max(p - 1, 0)),
    add, remove, clear, hydrated,
  };
}