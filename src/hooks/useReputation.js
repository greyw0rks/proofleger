"use client";
import { useState, useCallback } from "react";
const SCORES = { diploma:50, research:40, certificate:30, art:20, contribution:20, award:10, other:10 };
const TIERS = [{min:1000,label:"Legend",color:"#F7931A"},{min:500,label:"Authority",color:"#a78bfa"},{min:250,label:"Expert",color:"#22c55e"},{min:100,label:"Contributor",color:"#38bdf8"},{min:0,label:"Builder",color:"#666"}];
export function useReputation() {
  const [score, setScore] = useState(0);
  const [tier, setTier] = useState(TIERS[TIERS.length-1]);
  const calculate = useCallback((docs) => {
    let s = 0;
    for (const d of docs) { s += SCORES[d.docType]||10; s += (d.attestations||0)*10; if(d.hasNFT) s+=25; }
    const t = TIERS.find(t => s >= t.min) || TIERS[TIERS.length-1];
    setScore(s); setTier(t); return { score: s, tier: t };
  }, []);
  return { score, tier, calculate };
}
