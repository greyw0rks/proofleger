"use client";
import { useState, useCallback } from "react";
import { getCachedProof, cacheProof } from "@/lib/doc-store";
import { withRetry } from "@/lib/retry";

const API = "https://api.hiro.so";
const C   = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useVerify() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const verify = useCallback(async (hashHex) => {
    if (!hashHex) return;
    setLoading(true); setError(null); setResult(null);
    const clean = hashHex.replace(/^0x/i, "");

    // Check cache first
    const cached = await getCachedProof(clean);
    if (cached) { setResult(cached); setLoading(false); return cached; }

    try {
      const data = await withRetry(async () => {
        const res = await fetch(`${API}/v2/contracts/call-read/${C}/proofleger3/get-doc`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: C, arguments: ["0x0200000020" + clean] }),
        });
        if (res.status === 429) throw new Error("Rate limited");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }, { maxAttempts: 3, baseDelayMs: 2000 });

      const exists = data.okay && data.result && data.result !== "0x09";
      const proof  = { exists, raw: data.result, hash: clean };

      if (exists) await cacheProof(clean, proof);
      setResult(proof);
      return proof;
    } catch(e) { setError(e.message); return null; }
    finally { setLoading(false); }
  }, []);

  return { verify, result, loading, error,
    exists: result?.exists === true };
}