"use client";
import { useState, useCallback, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [hydrated, setHydrated]       = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) setStoredValue(JSON.parse(item));
    } catch { /* ignore parse errors, keep initialValue */ }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback((value) => {
    try {
      const toStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch(e) { console.warn("useLocalStorage write failed:", e); }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try { window.localStorage.removeItem(key); setStoredValue(initialValue); } catch {}
  }, [key, initialValue]);

  return [storedValue, setValue, { hydrated, removeValue }];
}