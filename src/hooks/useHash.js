"use client";
import { useState, useCallback } from "react";
import { hashFile, hashText } from "@/utils/hash";

export function useHash() {
  const [hash,     setHash]     = useState(null);
  const [hashing,  setHashing]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [error,    setError]    = useState(null);

  const hashFileInput = useCallback(async (file) => {
    if (!file) return null;
    setHashing(true); setProgress(0); setError(null);
    setFileName(file.name); setFileSize(file.size);
    try {
      const h = await hashFile(file, setProgress);
      setHash(h);
      return h;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setHashing(false);
    }
  }, []);

  const hashTextInput = useCallback(async (text) => {
    if (!text) return null;
    setHashing(true); setError(null);
    try {
      const h = await hashText(text);
      setHash(h);
      return h;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setHashing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setHash(null); setProgress(0);
    setFileName(null); setFileSize(null); setError(null);
  }, []);

  return {
    hash, hashing, progress, fileName, fileSize, error,
    hashFile: hashFileInput,
    hashText: hashTextInput,
    reset,
  };
}