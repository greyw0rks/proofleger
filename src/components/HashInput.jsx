"use client";
import { useState } from "react";
import { isHexHash } from "@/utils/hash";

export default function HashInput({ onHash, placeholder = "Paste 64-char SHA-256 hash..." }) {
  const [value,  setValue]  = useState("");
  const [valid,  setValid]  = useState(null); // null | true | false

  function handleChange(e) {
    const v = e.target.value.trim();
    setValue(v);
    if (!v) { setValid(null); return; }
    const ok = isHexHash(v);
    setValid(ok);
    if (ok) onHash?.(v.replace(/^0x/i, "").toLowerCase());
  }

  const borderColor = valid === null ? "#222" : valid ? "#00ff88" : "#ff3333";

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck={false}
        style={{ width: "100%", background: "#0a0a0a",
          border: `2px solid ${borderColor}`,
          color: "#f5f0e8", fontFamily: "Space Mono, monospace",
          fontSize: 11, padding: "11px 14px", outline: "none",
          boxSizing: "border-box", letterSpacing: 0.5,
          transition: "border-color 0.1s" }}
      />
      {value && (
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 8,
          color: valid ? "#00ff88" : "#ff3333", marginTop: 4 }}>
          {valid ? `✓ Valid SHA-256 hash (${value.length} chars)` : "✗ Invalid hash — must be 64 hex characters"}
        </div>
      )}
    </div>
  );
}