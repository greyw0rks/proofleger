"use client";
import { useState, useCallback } from "react";
export function useRecords(address) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const fetchRecords = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.hiro.so/extended/v1/address/${address}/transactions?limit=20&offset=${page * 20}`);
      const data = await res.json();
      setRecords(prev => page === 0 ? (data.results || []) : [...prev, ...(data.results || [])]);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [address, page]);
  return { records, loading, fetchRecords, setPage };
}
