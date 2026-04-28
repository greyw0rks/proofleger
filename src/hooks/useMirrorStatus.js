"use client";
import { useState, useEffect } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useMirrorStatus(hash) {
  const [mirror,  setMirror]  = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hash || !VERIFIER_API) return;
    setLoading(true);
    fetch(`${VERIFIER_API}/v2/mirror/${hash}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setMirror(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  return {
    mirror, loading,
    isMirrored:  !!mirror && mirror.found !== false,
    isConfirmed: mirror?.confirmed === 1,
    celoTx:      mirror?.celo_tx   ?? null,
    celoBlock:   mirror?.celo_block ?? null,
  };
}