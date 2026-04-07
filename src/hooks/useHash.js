"use client";
import { useState, useCallback } from "react";
export function useHash() {
  const [hash, setHash] = useState(null);
  const [hashing, setHashing] = useState(false);
  const hashFile = useCallback(async (file) => {
    setHashing(true);
    const buf = await file.arrayBuffer();
    const h = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,"0")).join("");
    setHash(hex); setHashing(false); return hex;
  }, []);
  const hashText = useCallback(async (text) => {
    setHashing(true);
    const buf = new TextEncoder().encode(text);
    const h = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,"0")).join("");
    setHash(hex); setHashing(false); return hex;
  }, []);
  return { hash, hashing, hashFile, hashText, clearHash: () => setHash(null) };
}
