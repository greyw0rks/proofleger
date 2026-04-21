"use client";
import { useState, useEffect } from "react";
import { cacheWrap } from "@/lib/cache";
const API = "https://api.hiro.so";
const C   = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useRecentActivity(limit = 20) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cacheWrap(`activity:${limit}`, async () => {
      const res = await fetch(`${API}/extended/v1/address/${C}.proofleger3/transactions?limit=${limit}`);
      const data = await res.json();
      return (data.results || [])
        .filter(t => t.tx_status === "success")
        .map(t => ({
          txid:     t.tx_id,
          fn:       t.contract_call?.function_name || "",
          sender:   t.sender_address,
          block:    t.block_height,
          time:     t.burn_block_time_iso,
          args:     t.contract_call?.function_args || [],
        }));
    }, 60_000)
      .then(setActivity)
      .catch(() => setActivity([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { activity, loading };
}