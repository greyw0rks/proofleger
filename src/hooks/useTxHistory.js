"use client";
import { useState, useCallback, useEffect } from "react";
import { useWalletContext } from "@/context/WalletContext";

const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useTxHistory(limit = 20) {
  const [txs, setTxs]         = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const { address }           = useWalletContext();

  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(
        `${API}/extended/v1/address/${address}/transactions?limit=${limit}&contract_id=${CONTRACT}.proofleger3`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTxs(data.results || []);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [address, limit]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { txs, loading, error, refresh: fetch_ };
}