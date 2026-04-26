"use client";
import { useState, useRef, useCallback } from "react";
import { hashFile } from "@/utils/hash";
import { formatBytes } from "@/utils/format";
import Spinner from "./Spinner";

export default function FileDropZone({ onHash, onFile }) {
  const [dragging,  setDragging]  = useState(false);
  const [hashing,   setHashing]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [fileName,  setFileName]  = useState(null);
  const [fileSize,  setFileSize]  = useState(null);
  const [hash,      setHash]      = useState(null);
  const inputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    setHashing(true); setProgress(0); setHash(null);
    try {
      const h = await hashFile(file, setProgress);
      setHash(h);
      onFile?.(file);
      onHash?.(h);
    } catch(e) {
      console.error("Hash error:", e);
    }
    setHashing(false);
  }, [onHash, onFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const borderColor = dragging ? "#F7931A" : hash ? "#00ff88" : "#222";

  return (
    <div
      onClick={() => !hashing && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{ border: `2px dashed ${borderColor}`, padding: "32px 24px",
        textAlign: "center", cursor: hashing ? "default" : "pointer",
        transition: "border-color 0.15s", background: dragging ? "#F7931A08" : "transparent" }}>
      <input ref={inputRef} type="file" style={{ display: "none" }}
        onChange={e => processFile(e.target.files?.[0])} />

      {hashing ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Spinner size={20} />
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#F7931A" }}>
            HASHING {progress}%
          </div>
          <div style={{ width: "100%", height: 2, background: "#111" }}>
            <div style={{ height: 2, background: "#F7931A",
              width: `${progress}%`, transition: "width 0.1s" }} />
          </div>
        </div>
      ) : hash ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 11, color: "#00ff88", letterSpacing: 2 }}>✓ FILE HASHED</div>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#555" }}>
            {fileName} · {formatBytes(fileSize)}
          </div>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 8, color: "#00ff88",
            wordBreak: "break-all", maxWidth: 360 }}>{hash}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 13, color: "#333", letterSpacing: 2 }}>DROP FILE HERE</div>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#2a2a2a" }}>
            or click to browse — any file type
          </div>
        </div>
      )}
    </div>
  );
}