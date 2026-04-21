"use client";
import { useState, useEffect, useCallback } from "react";
import { getHistory, addToHistory, clearHistory } from "@/lib/proof-history";

export function useProofHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setHistory(await getHistory(50)); }
    catch { setHistory([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { reload(); }, []);

  const add = useCallback(async (proof) => {
    await addToHistory(proof);
    await reload();
  }, [reload]);

  const clear = useCallback(async () => {
    await clearHistory();
    setHistory([]);
  }, []);

  return { history, loading, add, clear, reload };
}