"use client";
import { useState } from "react";
import { useMultiStep }    from "@/hooks/useMultiStep";
import { useNotification } from "@/hooks/useNotification";
import FileDropZone        from "./FileDropZone";
import DocTypeSelector     from "./DocTypeSelector";
import NetworkSwitcher     from "./NetworkSwitcher";
import ProgressSteps       from "./ProgressSteps";
import NotificationStack   from "./NotificationStack";
import { isValidTitle }    from "@/utils/validation";

const STEPS = ["FILE", "DETAILS", "CONFIRM"];

export default function AnchorForm({ onSuccess }) {
  const [hash,    setHash]    = useState("");
  const [file,    setFile]    = useState(null);
  const [title,   setTitle]   = useState("");
  const [docType, setDocType] = useState("other");
  const [loading, setLoading] = useState(false);

  const { notifications, remove, success, error: notifyError } = useNotification();

  const { step, next, back, isFirst, isLast, error: stepError, reset } = useMultiStep(STEPS, {
    0: () => hash ? true : "Drop a file or paste a hash to continue",
    1: () => isValidTitle(title) ? true : "Title must be 1–100 ASCII characters",
  });

  async function handleSubmit() {
    if (!hash || !title) return;
    setLoading(true);
    try {
      // Anchor call lives in useAnchor hook — this is the UI shell
      await new Promise(r => setTimeout(r, 800)); // placeholder
      success("Document anchored successfully");
      onSuccess?.({ hash, title, docType });
      reset();
      setHash(""); setTitle(""); setDocType("other"); setFile(null);
    } catch(e) {
      notifyError(e.message || "Anchor failed");
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8" }}>
      <NotificationStack notifications={notifications} onRemove={remove} />
      <ProgressSteps steps={STEPS} current={step} />

      {step === 0 && (
        <div>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
            SELECT FILE
          </div>
          <FileDropZone
            onHash={h => setHash(h)}
            onFile={f => setFile(f)}
          />
          {hash && (
            <div style={{ marginTop: 12, fontFamily: "Space Mono, monospace",
              fontSize: 9, color: "#00ff88" }}>
              ✓ HASH READY
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 8 }}>
              DOCUMENT TITLE
            </div>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              placeholder="e.g. MIT Computer Science Diploma 2026"
              style={{ width: "100%", background: "#0a0a0a", border: "2px solid #222",
                color: "#f5f0e8", fontFamily: "Space Mono, monospace",
                fontSize: 11, padding: "10px 14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 8 }}>
              DOCUMENT TYPE
            </div>
            <DocTypeSelector value={docType} onChange={setDocType} />
          </div>
          <div>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 8 }}>
              CHAIN
            </div>
            <NetworkSwitcher />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ border: "2px solid #222", padding: 20,
          display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 4 }}>
            CONFIRM ANCHOR
          </div>
          {[["TITLE", title], ["TYPE", docType.toUpperCase()],
            ["HASH", hash ? hash.slice(0, 20) + "..." : "—"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 9, color: "#555", letterSpacing: 1, minWidth: 48 }}>{k}</span>
              <span style={{ fontFamily: "Space Mono, monospace",
                fontSize: 10, color: "#f5f0e8", wordBreak: "break-all" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {stepError && (
        <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10,
          color: "#ff3333", marginTop: 12 }}>{stepError}</div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {!isFirst && (
          <button onClick={back}
            style={{ border: "2px solid #333", background: "transparent",
              color: "#555", padding: "10px 20px",
              fontFamily: "Archivo Black, sans-serif", fontSize: 10,
              cursor: "pointer", letterSpacing: 1 }}>← BACK</button>
        )}
        {!isLast ? (
          <button onClick={next}
            style={{ border: "2px solid #F7931A", background: "transparent",
              color: "#F7931A", padding: "10px 24px",
              fontFamily: "Archivo Black, sans-serif", fontSize: 10,
              cursor: "pointer", letterSpacing: 1 }}>NEXT →</button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            style={{ border: "2px solid #00ff88", background: "#00ff8812",
              color: "#00ff88", padding: "10px 28px",
              fontFamily: "Archivo Black, sans-serif", fontSize: 10,
              cursor: loading ? "default" : "pointer", letterSpacing: 1,
              opacity: loading ? 0.6 : 1 }}>
            {loading ? "ANCHORING..." : "ANCHOR DOCUMENT"}
          </button>
        )}
      </div>
    </div>
  );
}