import { useState, useEffect, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useStamp(proofHash) {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    if (!proofHash) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/v2/stamps/${proofHash}`);
      setStamps((await r.json()).stamps ?? []);
    } catch (_) {} finally { setLoading(false); }
  }, [proofHash]);
  useEffect(() => { fetch_(); }, [fetch_]);
  const topStamp = stamps[0] ?? null;
  const levelColor = { gold:"#FCFF52", silver:"#aaa", platinum:"#a78bfa", bronze:"#cd7f32", standard:"#F7931A" };
  const color = topStamp ? (levelColor[topStamp.level] ?? "#888") : null;
  return { stamps, topStamp, color, loading, refetch: fetch_ };
}