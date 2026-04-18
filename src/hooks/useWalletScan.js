"use client";
import { useState, useCallback } from "react";
import { scanWallet, getWalletNFTs } from "@/lib/wallet-scanner";

export function useWalletScan() {
  const [result, setResult] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scan = useCallback(async (address) => {
    if (!address) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const [scan, nftList] = await Promise.all([
        scanWallet(address),
        getWalletNFTs(address),
      ]);
      setResult(scan);
      setNfts(nftList);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  return { scan, result, nfts, loading, error };
}