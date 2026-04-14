"use client";
import { useState, useMemo } from "react";

export function useSearch(items = [], keys = []) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const results = useMemo(() => {
    let out = [...items];
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(item =>
        keys.some(key => String(item[key] || "").toLowerCase().includes(q))
      );
    }
    Object.entries(filters).forEach(([key, val]) => {
      if (val) out = out.filter(item => item[key] === val);
    });
    return out;
  }, [items, query, filters, keys]);

  return {
    query, setQuery,
    filters, setFilter: (k, v) => setFilters(f => ({ ...f, [k]: v })),
    clearFilters: () => setFilters({}),
    results,
    count: results.length,
  };
}