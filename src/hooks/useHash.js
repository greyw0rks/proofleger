"use client";
import { useState, useCallback } from "react";
import { sha256Hex } from "@/utils/crypto";
import { isLargeFile, hashLargeFile } from "@/lib/file-hasher";

export function useHash() {
  const [hash, setHash]       = useState(null);
  const [hashing, setHashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const hashFile = useCallback(async (file) => {
    if (!file) return;
    setHashing(true); setHash(null); setProgress(0);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    try {
      let result;
      if (isLargeFile(file, 5)) {
        result = await hashLargeFile(file, setProgress);
      } else {
        const buffer = await file.arrayBuffer();
        result = await sha256Hex(buffer);
        setProgress(100);
      }
      setHash(result);
      return result;
    } catch(e) { console.error("Hash failed:", e); return null; }
    finally { setHashing(false); }
  }, []);

  const hashText = useCallback(async (text) => {
    const enc = new TextEncoder();
    const result = await sha256Hex(enc.encode(text).buffer);
    setHash(result);
    return result;
  }, []);

  const reset = useCallback(() => {
    setHash(null); setProgress(0); setFileName(null); setFileSize(null);
  }, []);

  return { hash, hashing, progress, fileName, fileSize, hashFile, hashText, reset };
}