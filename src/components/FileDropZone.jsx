"use client";
import { useCallback, useState } from "react";
import { useHash } from "@/hooks/useHash";

export default function FileDropZone({ onHash, onFile }) {
  const { hash, hashing, progress, fileName, fileSize, hashFile, reset } = useHash();
  const [dragging, setDragging] = useState(false);

  const handle = useCallback(async (file) => {
    if (!file) return;
    const h = await hashFile(file);
    if (h) { if (onHash) onHash(h); if (onFile) onFile(file); }
  }, [hashFile, onHash, onFile]);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handle(f);
  }, [handle]);

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("pl-file-input").click()}
        style={{ border:`3px dashed ${dragging ? "#F7931A" : "#333"}`,
          padding:40, textAlign:"center", cursor:"pointer",
          background: dragging ? "rgba(247,147,26,0.05)" : "transparent",
          transition:"all 0.15s", marginBottom:12 }}>
        <input id="pl-file-input" type="file" style={{ display:"none" }}
          onChange={e => { const f = e.target.files[0]; if (f) handle(f); }} />
        {!hash && !hashing && (
          <div>
            <div style={{ fontSize:32, marginBottom:8 }}>📎</div>
            <div style={{ fontFamily:"Archivo Black, sans-serif",
              fontSize:13, color:"#555", letterSpacing:1 }}>
              DROP FILE OR CLICK TO SELECT
            </div>
            <div style={{ fontFamily:"Space Mono, monospace",
              fontSize:10, color:"#444", marginTop:6 }}>
              Any file type · Hashed client-side · Never uploaded
            </div>
          </div>
        )}
        {hashing && (
          <div>
            <div style={{ fontFamily:"Archivo Black, sans-serif",
              fontSize:13, color:"#F7931A", marginBottom:12 }}>HASHING...</div>
            <div style={{ height:4, background:"#1a1a1a", width:"80%", margin:"0 auto" }}>
              <div style={{ height:"100%", background:"#F7931A",
                width:`${progress}%`, transition:"width 0.3s" }} />
            </div>
            <div style={{ fontFamily:"Space Mono, monospace",
              fontSize:9, color:"#555", marginTop:6 }}>{progress}%</div>
          </div>
        )}
        {hash && !hashing && (
          <div>
            <div style={{ fontFamily:"Archivo Black, sans-serif",
              fontSize:12, color:"#f5f0e8", marginBottom:6 }}>
              {fileName}
            </div>
            <div style={{ fontFamily:"Space Mono, monospace",
              fontSize:9, color:"#555", marginBottom:8 }}>{fileSize}</div>
            <div style={{ fontFamily:"Space Mono, monospace",
              fontSize:9, color:"#F7931A", wordBreak:"break-all" }}>
              {hash}
            </div>
          </div>
        )}
      </div>
      {hash && (
        <button onClick={e => { e.stopPropagation(); reset(); }}
          style={{ border:"none", background:"transparent",
            color:"#555", fontFamily:"Space Mono, monospace",
            fontSize:10, cursor:"pointer" }}>
          ✕ Remove file
        </button>
      )}
    </div>
  );
}