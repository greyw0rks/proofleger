"use client";
import { useState, useCallback } from "react";
import { buildShareUrl, nativeShare } from "@/lib/share-handler";

export function useShare() {
  const [showModal, setShowModal] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);

  const share = useCallback(async (type, value, title) => {
    const url = buildShareUrl(type, value);
    if (navigator?.share) {
      try { await nativeShare(title || "ProofLedger", url); return; }
      catch {} // fallback to modal
    }
    setShareTarget({ url, title, type, value });
    setShowModal(true);
  }, []);

  return { share, showModal, shareTarget,
    close: () => setShowModal(false) };
}