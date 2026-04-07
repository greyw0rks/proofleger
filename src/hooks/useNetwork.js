"use client";
import { useState, useEffect } from "react";
export function useNetwork() {
  const [blockHeight, setBlockHeight] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://api.hiro.so/v2/info")
      .then(r => r.json())
      .then(d => { setBlockHeight(d.stacks_tip_height); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return { blockHeight, loading };
}
