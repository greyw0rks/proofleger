"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API = "https://api.hiro.so";
const POLL_INTERVAL = 10_000;

export function useTransactionStatus(txId) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockHeight, setBlockHeight] = useState(null);
  const timer = useRef(null);

  const check = useCallback(async () => {
    if (!txId) return;
    try {
      const res = await fetch(`${API}/extended/v1/tx/${txId}`);
      const data = await res.json();
      setStatus(data.tx_status);
      setBlockHeight(data.block_height || null);
      if (data.tx_status === "success" || data.tx_status === "abort_by_response") {
        clearInterval(timer.current);
        setLoading(false);
      }
    } catch {}
  }, [txId]);

  useEffect(() => {
    if (!txId) return;
    setLoading(true); setStatus("pending");
    check();
    timer.current = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(timer.current);
  }, [txId]);

  return { status, loading, blockHeight,
    isPending: status === "pending",
    isSuccess: status === "success",
    isFailed: status === "abort_by_response" };
}