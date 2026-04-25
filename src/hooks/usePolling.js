"use client";
import { useEffect, useRef, useCallback } from "react";

export function usePolling(fn, intervalMs = 15_000, { enabled = true, pauseOnBlur = true } = {}) {
  const fnRef      = useRef(fn);
  const timerRef   = useRef(null);
  const activeRef  = useRef(true);

  useEffect(() => { fnRef.current = fn; }, [fn]);

  const stop  = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  const start = useCallback(() => {
    stop();
    if (!enabled) return;
    timerRef.current = setInterval(() => { if (activeRef.current) fnRef.current(); }, intervalMs);
  }, [enabled, intervalMs, stop]);

  useEffect(() => {
    if (!pauseOnBlur) return;
    const onFocus = () => { activeRef.current = true; };
    const onBlur  = () => { activeRef.current = false; };
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur",  onBlur);
    return () => { window.removeEventListener("focus", onFocus); window.removeEventListener("blur", onBlur); };
  }, [pauseOnBlur]);

  useEffect(() => { start(); return stop; }, [start, stop]);

  return { start, stop };
}