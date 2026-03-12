"use client";
import { useState, useCallback } from "react";
import {
  anchorDocument,
  verifyDocument,
  attestDocument,
  mintAchievement,
  getAddress,
} from "@/lib/wallet";

/**
 * useProofLedger - React hook wrapping all ProofLedger contract interactions
 *
 * Provides loading state, error handling, and result management
 * for anchor, verify, attest, and mint operations.
 *
 * @returns {{
 *   anchor: function,
 *   verify: function,
 *   attest: function,
 *   mint: function,
 *   loading: boolean,
 *   error: string|null,
 *   result: any,
 *   clearError: function
 * }}
 */
export function useProofLedger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const withLoading = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fn();
      setResult(res);
      return res;
    } catch (err) {
      const msg = err?.message || "An unexpected error occurred";
      setError(msg);
      console.error("useProofLedger error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Anchors a document hash to the Stacks blockchain
   * @param {string} hash - SHA-256 hex hash
   * @param {string} title - Document title (max 100 chars)
   * @param {string} docType - Document type (diploma, certificate, etc.)
   */
  const anchor = useCallback(
    (hash, title, docType) =>
      withLoading(() => anchorDocument(hash, title, docType)),
    [withLoading]
  );

  /**
   * Verifies a document hash exists on chain
   * @param {string} hash - SHA-256 hex hash to verify
   */
  const verify = useCallback(
    (hash) => withLoading(() => verifyDocument(hash)),
    [withLoading]
  );

  /**
   * Attests to a document anchored by another wallet
   * @param {string} hash - SHA-256 hex hash to attest
   */
  const attest = useCallback(
    (hash) => withLoading(() => attestDocument(hash)),
    [withLoading]
  );

  /**
   * Mints a soulbound achievement NFT
   * @param {string} hash - Hash of the credential document
   * @param {string} docType - Achievement type
   * @param {string} title - Achievement title
   */
  const mint = useCallback(
    (hash, docType, title) =>
      withLoading(() => mintAchievement(hash, docType, title)),
    [withLoading]
  );

  return { anchor, verify, attest, mint, loading, error, result, clearError };
}
