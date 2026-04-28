"use client";
import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useSearch() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(0);

  const debounced = useDebounce(query, 350);

  const search = useCallback(async (q, offset = 0) => {
    if (!q || q.length < 2) { setResults([]); setTotal(0); return; }
    setLoading(true);
    try {
      const res  = await fetch(
        `${VERIFIER_API}/v2/search?q=${encodeURIComponent(q)}&offset=${offset}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total  || 0);
    } catch {}
    setLoading(false);
  }, []);

  useState(() => { search(debounced, page * 20); }, [debounced, page]);

  return {
    query, setQuery,
    results, total, loading,
    page, setPage,
    totalPages: Math.ceil(total / 20),
    clear: () => { setQuery(""); setResults([]); setTotal(0); setPage(0); },
  };
}