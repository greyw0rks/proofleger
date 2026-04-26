"use client";
import { useState } from "react";
import { useVerify }      from "@/hooks/useVerify";
import { useCeloVerify }  from "@/hooks/useCeloVerify";
import { useHash }        from "@/hooks/useHash";
import FileDropZone       from "./FileDropZone";
import VerifyResult       from "./VerifyResult";
import Spinner            from "./Spinner";
import { isHexHash }      from "@/utils/hash";

export default function VerifyForm() {
  const [input,  setInput]  = useState("");
  const [mode,   setMode]   = useState("paste"); // "paste" | "file"
  const stacks = useVerify();
  const celo   = useCeloVerify();
  const { hashFile, hashing, progress } = useHash?.() || {};

  const loading = stacks.loading || celo.loading || hashing;

  async function handleVerify(hash) {
    await Promise.all([stacks.verify(hash), celo.verify(hash)]);
  }

  async function handleInput(val) {
    setInput(val);
    if (isHexHash(val)) await handleVerify(val.replace(/^0x/i, ""));
  }

  function handleReset() {
    setInput(""); stacks.reset(); celo.reset();
  }

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8" }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #111" }}>
        {["paste", "file"].map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ border: "none", borderBottom: mode === m ? "2px solid #F7931A" : "none",
              background: "transparent", color: mode === m ? "#F7931A" : "#555",
              fontFamily: "Archivo Black, sans-serif", fontSize: 10, padding: "8px 18px",
              cursor: "pointer", letterSpacing: 1, marginBottom: -2 }}>
            {m === "paste" ? "PASTE HASH" : "UPLOAD FILE"}
          </button>
        ))}
      </div>

      {mode === "paste" ? (
        <div style={{ position: "relative" }}>
          <input
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder="Paste SHA-256 hash (64 hex chars)..."
            style={{ width: "100%", background: "#0a0a0a", border: "2px solid #222",
              color: "#f5f0e8", fontFamily: "Space Mono, monospace", fontSize: 11,
              padding: "12px 14px", outline: "none", boxSizing: "border-box",
              letterSpacing: 0.5 }}
          />
        </div>
      ) : (
        <FileDropZone
          onHash={async (hash) => { setInput(hash); await handleVerify(hash); }}
        />
      )}

      {hashing && progress != null && (
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9,
          color: "#F7931A", marginTop: 8 }}>
          HASHING... {progress}%
        </div>
      )}

      {loading && !hashing && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
          <Spinner size={14} />
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#555" }}>
            CHECKING STACKS + CELO...
          </span>
        </div>
      )}

      {(stacks.result || celo.result) && !loading && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {stacks.result && <VerifyResult result={stacks.result} />}
          {celo.result && celo.result !== stacks.result && (
            <VerifyResult result={celo.result} />
          )}
          <button onClick={handleReset}
            style={{ border: "2px solid #333", background: "transparent",
              color: "#555", padding: "8px 16px", alignSelf: "flex-start",
              fontFamily: "Archivo Black, sans-serif", fontSize: 9,
              cursor: "pointer", letterSpacing: 1 }}>
            ↺ VERIFY ANOTHER
          </button>
        </div>
      )}
    </div>
  );
}