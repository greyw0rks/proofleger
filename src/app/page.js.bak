"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import { isWalletConnected, getAddress, anchorDocument, verifyDocument, attestDocument, mintAchievement, getAchievementMeta } from "@/lib/wallet";

const ORANGE = "#F7931A";
const DARK = "#0a0a0a";
const CARD = "#111111";
const BORDER = "#1e1e1e";
const TEXT = "#e8e8e8";
const MUTED = "#666";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #f0f0f0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .mono { font-family: 'DM Mono', monospace; }
  .app { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }
  .header { padding: 28px 0 28px; margin-bottom: 0; display: flex; align-items: center; justify-content: space-between; position: relative; }
  .header::after { content: ''; position: absolute; bottom: 0; left: -24px; right: -24px; height: 1px; background: linear-gradient(90deg, transparent, #F7931A33, #F7931A66, #F7931A33, transparent); }
  .logo { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 38px; height: 38px; background: #F7931A; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 20px rgba(247,147,26,0.4); }
  .logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; color: #fff; }
  .logo-sub { font-size: 10px; color: #555; font-family: 'DM Mono', monospace; letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }
  .wallet-btn { background: transparent; border: 1px solid #222; color: #f0f0f0; padding: 10px 20px; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; text-transform: uppercase; }
  .wallet-btn:hover { border-color: #F7931A; color: #F7931A; box-shadow: 0 0 12px rgba(247,147,26,0.15); }
  .wallet-btn.connected { border-color: #22c55e44; color: #22c55e; }
  .hero { padding: 56px 0 48px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -40px; right: -60px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%); pointer-events: none; }
  .hero-eyebrow { font-size: 10px; font-family: 'DM Mono', monospace; color: #F7931A; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .hero-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1px; background: #F7931A; }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 8vw, 80px); letter-spacing: 3px; line-height: 0.95; color: #fff; margin-bottom: 20px; }
  .hero-title span { color: #F7931A; }
  .hero-sub { font-size: 15px; color: #666; max-width: 480px; line-height: 1.7; font-weight: 400; }
  .tabs { display: flex; gap: 2px; margin-bottom: 32px; background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 8px; padding: 4px; }
  .tab { flex: 1; padding: 10px; background: transparent; border: none; color: #555; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 5px; transition: all 0.2s; letter-spacing: 0.5px; text-transform: uppercase; font-size: 11px; }
  .tab.active { background: #F7931A; color: #000; box-shadow: 0 0 16px rgba(247,147,26,0.3); }
  .tab:hover:not(.active) { color: #f0f0f0; }
  .card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 12px; padding: 32px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #F7931A22, transparent); }
  .card-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; margin-bottom: 8px; color: #fff; }
  .card-desc { font-size: 13px; color: #555; margin-bottom: 32px; line-height: 1.7; font-family: 'DM Mono', monospace; }
  .drop-zone { border: 1px dashed #222; border-radius: 10px; padding: 56px 32px; text-align: center; cursor: pointer; transition: all 0.3s; position: relative; background: #080808; }
  .drop-zone:hover, .drop-zone.drag { border-color: #F7931A; background: rgba(247,147,26,0.03); box-shadow: inset 0 0 40px rgba(247,147,26,0.04); }
  .drop-icon { font-size: 36px; margin-bottom: 16px; opacity: 0.5; }
  .drop-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #f0f0f0; }
  .drop-sub { font-size: 12px; color: #444; font-family: 'DM Mono', monospace; }
  .drop-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .file-info { margin-top: 24px; padding: 20px; background: #080808; border: 1px solid #1a1a1a; border-radius: 8px; }
  .file-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .file-row:last-child { margin-bottom: 0; }
  .file-label { font-size: 10px; color: #444; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 1.5px; }
  .file-value { font-size: 12px; font-family: 'DM Mono', monospace; color: #f0f0f0; word-break: break-all; text-align: right; max-width: 60%; }
  .hash-display { margin-top: 24px; padding: 16px 20px; background: rgba(247,147,26,0.04); border: 1px solid rgba(247,147,26,0.2); border-radius: 8px; }
  .hash-label { font-size: 9px; color: #F7931A; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
  .hash-value { font-size: 11px; font-family: 'DM Mono', monospace; color: #F7931A; word-break: break-all; line-height: 1.7; opacity: 0.8; }
  .meta-section { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .input-group.full { grid-column: 1 / -1; }
  .input-label { font-size: 10px; color: #444; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 1.5px; }
  .input-field { background: #080808; border: 1px solid #1a1a1a; border-radius: 6px; padding: 12px 14px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; width: 100%; }
  .input-field:focus { border-color: #F7931A; box-shadow: 0 0 0 1px rgba(247,147,26,0.1); }
  .anchor-btn { margin-top: 28px; width: 100%; padding: 16px; background: #F7931A; color: #000; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 24px rgba(247,147,26,0.25); }
  .anchor-btn:hover { background: #ffaa33; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(247,147,26,0.35); }
  .anchor-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
  .success-card { margin-top: 24px; padding: 24px; background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; text-align: center; }
  .success-icon { font-size: 32px; margin-bottom: 12px; }
  .success-title { font-size: 16px; font-weight: 700; color: #22c55e; margin-bottom: 6px; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; font-size: 22px; }
  .success-sub { font-size: 11px; color: #444; font-family: 'DM Mono', monospace; }
  .records-list { display: flex; flex-direction: column; gap: 10px; }
  .record-card { background: #080808; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; transition: border-color 0.2s; }
  .record-card:hover { border-color: #F7931A33; }
  .record-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .record-type-badge { font-size: 9px; font-family: 'DM Mono', monospace; background: rgba(247,147,26,0.1); color: #F7931A; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; letter-spacing: 1px; }
  .record-name { font-size: 15px; font-weight: 600; color: #f0f0f0; }
  .record-block { font-size: 10px; font-family: 'DM Mono', monospace; color: #444; }
  .record-hash { font-size: 10px; font-family: 'DM Mono', monospace; color: #333; margin-top: 8px; word-break: break-all; }
  .record-owner { font-size: 10px; font-family: 'DM Mono', monospace; color: #444; margin-top: 4px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #444; }
  .empty-icon { font-size: 36px; margin-bottom: 16px; opacity: 0.3; }
  .empty-text { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #555; }
  .empty-sub { font-size: 11px; font-family: 'DM Mono', monospace; color: #333; }
  .verify-result { margin-top: 24px; padding: 24px; border-radius: 8px; text-align: center; }
  .verify-result.found { background: rgba(34,197,94,0.04); border: 1px solid rgba(34,197,94,0.2); }
  .verify-result.not-found { background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.2); }
  .verify-icon { font-size: 36px; margin-bottom: 12px; }
  .verify-status { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; margin-bottom: 16px; }
  .verify-status.ok { color: #22c55e; }
  .verify-status.fail { color: #ef4444; }
  .verify-detail { display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.04); text-align: left; }
  .verify-detail-label { font-size: 10px; font-family: 'DM Mono', monospace; color: #444; text-transform: uppercase; letter-spacing: 1px; }
  .verify-detail-value { font-size: 11px; font-family: 'DM Mono', monospace; color: #f0f0f0; }
  .bitcoin-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(247,147,26,0.04); border: 1px solid rgba(247,147,26,0.12); border-radius: 6px; margin: 24px 0 32px; }
  .bitcoin-dot { width: 6px; height: 6px; background: #F7931A; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 6px rgba(247,147,26,0.6); }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .bitcoin-bar-text { font-size: 11px; font-family: 'DM Mono', monospace; color: #F7931A; letter-spacing: 0.5px; }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .timeline-year { font-size: 10px; font-family: 'DM Mono', monospace; color: #F7931A; text-transform: uppercase; letter-spacing: 3px; margin: 28px 0 12px; }
  .copy-btn { background: transparent; border: 1px solid #1a1a1a; color: #444; font-size: 9px; font-family: 'DM Mono', monospace; padding: 4px 10px; border-radius: 3px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; text-transform: uppercase; }
  .copy-btn:hover { border-color: #F7931A; color: #F7931A; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; backdrop-filter: blur(4px); }
  .modal { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 12px; padding: 32px; width: 100%; max-width: 420px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; margin-bottom: 8px; color: #fff; }
  .modal-sub { font-size: 12px; color: #444; margin-bottom: 24px; line-height: 1.7; font-family: 'DM Mono', monospace; }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .modal-cancel { flex: 1; padding: 12px; background: transparent; border: 1px solid #1a1a1a; color: #444; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
  .modal-cancel:hover { border-color: #333; color: #f0f0f0; }
  .modal-confirm { flex: 2; padding: 12px; background: #F7931A; border: none; color: #000; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
  .modal-confirm:hover { background: #ffaa33; }
  .modal-confirm:disabled { opacity: 0.3; cursor: not-allowed; }
  .cred-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .cred-option { padding: 10px; background: #080808; border: 1px solid #1a1a1a; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 10px; color: #444; cursor: pointer; transition: all 0.2s; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
  .cred-option:hover, .cred-option.selected { border-color: #F7931A; color: #F7931A; background: rgba(247,147,26,0.04); }
  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 12px; z-index: 200; display: flex; align-items: center; gap: 10px; animation: slideup 0.3s ease; white-space: nowrap; letter-spacing: 0.5px; }
  .toast.success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #22c55e; }
  .toast.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; }
  .toast.info { background: rgba(247,147,26,0.08); border: 1px solid rgba(247,147,26,0.25); color: #F7931A; }
  @keyframes slideup { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  .nav-link { font-size: 11px; font-family: 'DM Mono', monospace; color: #f0f0f0; text-decoration: none; border: 1px solid #1a1a1a; padding: 9px 16px; border-radius: 6px; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }
  .nav-link:hover { border-color: #F7931A33; color: #F7931A; }
  .nav-link.orange { border-color: rgba(247,147,26,0.3); color: #F7931A; }
  .nav-link.orange:hover { background: rgba(247,147,26,0.08); }
  .section-divider { height: 1px; background: linear-gradient(90deg, transparent, #1a1a1a, transparent); margin: 40px 0; }
`;



async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const { createHash } = await import("crypto");
  const hash = createHash("sha256");
  hash.update(Buffer.from(buffer));
  return hash.digest("hex");
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ProofLedger() {
  const [tab, setTab] = useState("anchor");
  const [attestModal, setAttestModal] = useState(null);
  const [credType, setCredType] = useState("");
  const [attesting, setAttesting] = useState(false);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [hashing, setHashing] = useState(false);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const [anchoring, setAnchoring] = useState(false);
  const [anchored, setAnchored] = useState(false);
  const [records, setRecords] = useState([]);
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const fileRef = useRef();
const [toast, setToast] = useState(null);

const showToast = (message, type = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3500);
};

  useEffect(() => {
    if (isWalletConnected()) setWalletAddress(getAddress());
  }, []);

  const onFileSelect = useCallback(async (f) => {
    if (!f) return;
    setFile(f);
    setHash("");
    setAnchored(false);
    setHashing(true);
    const h = await hashFile(f);
    setHash(h);
    setHashing(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  }, [onFileSelect]);

  const onAnchor = async () => {
  if (!hash || !walletAddress) return;
  setAnchoring(true);
  anchorDocument(
    hash,
    title || file.name,
    docType,
    (txId) => {
      const newRecord = {
        id: Date.now(),
        title: title || file.name,
        type: docType,
        hash,
        owner: walletAddress,
        block: "pending",
        year: new Date().getFullYear(),
        txId,
      };
      setRecords(prev => [newRecord, ...prev]);
      setAnchoring(false);
      setAnchored(true);
    },
    (err) => {
      console.error(err);
      setAnchoring(false);
    }
  );
};

  const onVerifyFile = useCallback(async (f) => {
    if (!f) return;
    setVerifyFile(f);
    setVerifyHash("");
    setVerifyResult(null);
    const h = await hashFile(f);
    setVerifyHash(h);
  }, []);

 const onVerify = async () => {
  if (!verifyHash) return;
  setVerifying(true);
  const result = await verifyDocument(verifyHash);
  setVerifyResult(result);
  setVerifying(false);
};

  const copyHash = (h) => {
    navigator.clipboard.writeText(h);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const groupByYear = (recs) => {
    const grouped = {};
    recs.forEach(r => {
      if (!grouped[r.year]) grouped[r.year] = [];
      grouped[r.year].push(r);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">₿</div>
            <div>
              <div className="logo-text">ProofLedger</div>
              <div className="logo-sub">Anchored to Bitcoin</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalletButton onConnect={setWalletAddress} onDisconnect={() => setWalletAddress(null)} />
            {walletAddress && (
              <a href={"/profile/" + walletAddress} className="nav-link orange">
                My Profile
              </a>
            )}
            {walletAddress && (
              <a href={"/cv/" + walletAddress} className="nav-link">
                My CV
              </a>
            )}
          </div>
        </header>
        <div className="hero">
          <div className="hero-eyebrow">Built on Stacks · Secured by Bitcoin</div>
          <div className="hero-title">PROOF OF<br /><span>EVERYTHING</span></div>
          <div className="hero-sub">Anchor any document to Bitcoin. Permanent, verifiable, unstoppable. Your credentials live on-chain forever.</div>
        </div>

        <div className="bitcoin-bar">
          <div className="bitcoin-dot" />
          <span className="bitcoin-bar-text mono">
            Stacks mainnet · Bitcoin block #841,234 · 2,847 proofs anchored
          </span>
        </div>

        <div className="tabs">
          {["anchor", "verify", "records"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "anchor" ? "Anchor Document" : t === "verify" ? "Verify" : "My Records"}
            </button>
          ))}
        </div>

        {tab === "anchor" && (
          <div className="card">
            <div className="card-title">Anchor to Bitcoin</div>
            <div className="card-desc">
              Upload any file. We generate a SHA-256 hash and store it on Stacks.
              Your document stays private. Only the proof goes on-chain.
            </div>
            <div
              className={`drop-zone ${drag ? "drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
            >
              <input ref={fileRef} type="file" className="drop-input" onChange={e => onFileSelect(e.target.files[0])} />
              {!file ? (
                <>
                  <div className="drop-icon">⬆</div>
                  <div className="drop-title">Drop your file here</div>
                  <div className="drop-sub mono">PDF, JPG, PNG, DOCX, any format</div>
                </>
              ) : (
                <>
                  <div className="drop-icon">📄</div>
                  <div className="drop-title">{file.name}</div>
                  <div className="drop-sub mono">{formatSize(file.size)} · Click to change</div>
                </>
              )}
            </div>

            {file && (
              <div className="file-info">
                <div className="file-row">
                  <span className="file-label mono">Filename</span>
                  <span className="file-value mono">{file.name}</span>
                </div>
                <div className="file-row">
                  <span className="file-label mono">Size</span>
                  <span className="file-value mono">{formatSize(file.size)}</span>
                </div>
                <div className="file-row">
                  <span className="file-label mono">Last Modified</span>
                  <span className="file-value mono">{new Date(file.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {hashing && (
              <div className="hash-display" style={{ textAlign: "center" }}>
                <div className="hash-label">Generating SHA-256 hash...</div>
              </div>
            )}

            {hash && !hashing && (
              <div className="hash-display">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="hash-label">SHA-256 Hash</div>
                  <button className="copy-btn" onClick={() => copyHash(hash)}>{copied ? "Copied!" : "Copy"}</button>
                </div>
                <div className="hash-value mono">{hash}</div>
              </div>
            )}

            {hash && (
              <div className="meta-section">
                <div className="input-group full">
                  <label className="input-label mono">Document Title</label>
                  <input className="input-field" placeholder="e.g. Computer Science Diploma 2026" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label mono">Document Type</label>
                  <select className="input-field" value={docType} onChange={e => setDocType(e.target.value)}>
                    <option value="diploma">Diploma</option>
                    <option value="research">Research Paper</option>
                    <option value="art">Artwork</option>
                    <option value="contract">Contract</option>
                    <option value="identity">Identity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label mono">IPFS Link (optional)</label>
                  <input className="input-field" placeholder="ipfs://Qm..." />
                </div>
              </div>
            )}

            <button className="anchor-btn" disabled={!hash || anchoring || anchored || !walletAddress} onClick={onAnchor}>
              {anchoring ? <><span className="spinner" />Anchoring to Bitcoin...</> :
               anchored ? "Anchored to Bitcoin" :
               !walletAddress ? "Connect Wallet First" :
               "Anchor to Bitcoin"}
            </button>

            {anchored && (
              <div className="success-card">
                <div className="success-icon">✓</div>
                <div className="success-title">Anchored to Bitcoin</div>
                <div className="success-sub mono">Your proof is permanent. Bitcoin secures it now.</div>
              </div>
            )}
          </div>
        )}

        {tab === "verify" && (
          <div className="card">
            <div className="card-title">Verify Document</div>
            <div className="card-desc">Upload any document to check if it was anchored on-chain. The original file never leaves your device.</div>
            <div
              className={`drop-zone ${drag ? "drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); onVerifyFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("vfile").click()}
            >
              <input id="vfile" type="file" className="drop-input" onChange={e => onVerifyFile(e.target.files[0])} />
              {!verifyFile ? (
                <>
                  <div className="drop-icon">🔍</div>
                  <div className="drop-title">Drop document to verify</div>
                  <div className="drop-sub mono">We hash it locally and check on-chain</div>
                </>
              ) : (
                <>
                  <div className="drop-icon">📄</div>
                  <div className="drop-title">{verifyFile.name}</div>
                  <div className="drop-sub mono">{formatSize(verifyFile.size)}</div>
                </>
              )}
            </div>

            {verifyHash && (
              <div className="hash-display" style={{ marginTop: 24 }}>
                <div className="hash-label">Computed Hash</div>
                <div className="hash-value mono">{verifyHash}</div>
              </div>
            )}

            {verifyHash && (
              <button className="anchor-btn" onClick={onVerify} disabled={verifying}>
                {verifying ? <><span className="spinner" />Checking on-chain...</> : "Check On-Chain"}
              </button>
            )}

            {verifyResult !== null && !verifying && (
              <div className={`verify-result ${verifyResult ? "found" : "not-found"}`}>
                <div className="verify-icon">{verifyResult ? "✓" : "✗"}</div>
                <div className={`verify-status ${verifyResult ? "ok" : "fail"}`}>
                  {verifyResult ? "Verified on Bitcoin" : "Not found on chain"}
                </div>
                {verifyResult && (
  <>
    <div className="verify-detail">
      <span className="verify-detail-label mono">Title</span>
      <span className="verify-detail-value mono">{verifyResult.title}</span>
    </div>
    <div className="verify-detail">
      <span className="verify-detail-label mono">Owner</span>
      <span className="verify-detail-value mono">{verifyResult.owner.slice(0,10)}...{verifyResult.owner.slice(-6)}</span>
    </div>
    <div className="verify-detail">
      <span className="verify-detail-label mono">Block Height</span>
      <span className="verify-detail-value mono">{verifyResult.block.toLocaleString()}</span>
    </div>
    <div className="verify-detail">
      <span className="verify-detail-label mono">Type</span>
      <span className="verify-detail-value mono">{verifyResult.docType}</span>
    </div>
  </>
)}
              </div>
            )}
          </div>
        )}

        {tab === "records" && (
          <div className="card">
            <div className="card-title">My Records</div>
            <div className="card-desc">Your Bitcoin-backed achievement ledger. Every entry is permanent.</div>
            {records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-text">No records yet</div>
                <div className="empty-sub mono">Anchor your first document to get started</div>
              </div>
            ) : (
              <div className="records-list">
                {groupByYear(records).map(([year, recs]) => (
                  <div key={year}>
                    <div className="timeline-year">{year}</div>
                    {recs.map(r => (
                      <div key={r.id} className="record-card">
                        <div className="record-top">
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span className="record-name">{r.title}</span>
                              <span className="record-type-badge">{r.type}</span>
                            </div>
                            <div className="record-owner mono">Owner: {r.owner.slice(0,10)}...{r.owner.slice(-6)}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="record-block mono">Block #{r.block.toLocaleString()}</div>
                            <button className="copy-btn" style={{ marginTop: 6 }} onClick={() => copyHash(r.hash)}>Copy hash</button>
                          </div>
                        </div>
                        <div className="record-hash mono">SHA-256: {r.hash.slice(0,32)}...</div>
<div style={{ marginTop: 10, display: "flex", gap: 8 }}>
<button
  className="copy-btn"
  onClick={() => setAttestModal(r)}
>
  + Attest
</button>
<button
  className="copy-btn"
  style={{ borderColor: "rgba(247,147,26,0.3)", color: "#F7931A" }}
  onClick={() => {
    const meta = getAchievementMeta(r.type);
    mintAchievement(
      r.hash,
      r.type,
      r.title,
      (txId) => showToast(getAchievementMeta(r.type).icon + " NFT minted successfully"),
(err) => showToast("Mint cancelled", "error")
    );
  }}
>
  {getAchievementMeta(r.type).icon} Mint NFT
</button>
</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
{attestModal && (
  <div className="modal-overlay" onClick={() => setAttestModal(null)}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-title">Attest Credential</div>
      <div className="modal-sub">
        You are signing this document as a verified issuer.
        Your wallet address will be permanently tied to this credential.
      </div>
      <div className="input-label mono" style={{ marginBottom: 10 }}>Credential Type</div>
      <div className="cred-options">
        {["degree", "employment", "certificate", "research", "contribution", "award", "identity", "other"].map(opt => (
          <div
            key={opt}
            className={`cred-option ${credType === opt ? "selected" : ""}`}
            onClick={() => setCredType(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
      <input
        className="input-field"
        placeholder="Or type a custom credential..."
        value={credType}
        onChange={e => setCredType(e.target.value)}
      />
      <div className="modal-actions">
        <button className="modal-cancel" onClick={() => { setAttestModal(null); setCredType(""); }}>
          Cancel
        </button>
        <button
          className="modal-confirm"
          disabled={!credType || attesting}
          onClick={() => {
            setAttesting(true);
            attestDocument(
              attestModal.hash,
              credType.slice(0, 50),
              (txId) => {
                setAttesting(false);
                setAttestModal(null);
                setCredType("");
                showToast("Attestation submitted to Bitcoin");
              },
              (err) => {
                setAttesting(false);
                showToast("Cancelled", "error");
              }
            );
          }}
        >
          {attesting ? "Submitting..." : "Sign Credential"}
        </button>
      </div>
    </div>
  </div>
)}
{toast && (
  <div className={`toast ${toast.type}`}>
    {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "●"}
    {toast.message}
  </div>
)}
    </>
  );
}
