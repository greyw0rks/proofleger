"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import { isWalletConnected, getAddress, anchorDocument, verifyDocument, attestDocument, mintAchievement, getAchievementMeta } from "@/lib/wallet";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap');
  :root {
    --black: #0a0a0a; --white: #f5f0e8; --orange: #F7931A; --orange-dark: #d4780f;
    --green: #00ff88; --red: #ff3333;
    --border: 3px solid #f5f0e8; --shadow: 6px 6px 0px #f5f0e8;
    --shadow-orange: 6px 6px 0px #F7931A; --shadow-sm: 3px 3px 0px #f5f0e8;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  ::selection { background: var(--orange); color: #000; }
  .app { max-width: 960px; margin: 0 auto; padding: 0 24px 100px; }
  .header { padding: 24px 0; display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border); }
  .logo { display: flex; align-items: center; gap: 0; }
  .logo-icon { width: 44px; height: 44px; background: var(--orange); border: var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Archivo Black', sans-serif; font-size: 20px; color: #000; flex-shrink: 0; }
  .logo-text { font-family: 'Archivo Black', sans-serif; font-size: 22px; letter-spacing: -0.5px; color: var(--white); padding: 0 14px; border-top: var(--border); border-bottom: var(--border); border-right: var(--border); height: 44px; display: flex; align-items: center; }
  .logo-sub { font-family: 'Space Mono', monospace; font-size: 9px; color: var(--orange); padding: 0 10px; border-top: var(--border); border-bottom: var(--border); border-right: var(--border); height: 44px; display: flex; align-items: center; letter-spacing: 1px; text-transform: uppercase; }
  .header-right { display: flex; align-items: center; gap: 0; }
  .nav-link { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--white); text-decoration: none; border: var(--border); padding: 8px 14px; text-transform: uppercase; letter-spacing: 1px; margin-left: -3px; transition: background 0.1s, color 0.1s; height: 40px; display: flex; align-items: center; }
  .nav-link:hover { background: var(--white); color: #000; }
  .nav-link.orange { background: var(--orange); color: #000; border-color: var(--orange); }
  .nav-link.orange:hover { background: var(--orange-dark); }
  .hero { padding: 64px 0 48px; border-bottom: var(--border); position: relative; overflow: hidden; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; border: var(--border); padding: 6px 14px; font-family: 'Space Mono', monospace; font-size: 10px; color: var(--orange); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 28px; }
  .hero-dot { width: 8px; height: 8px; background: var(--orange); animation: blink 1.2s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .hero-title { font-family: 'Archivo Black', sans-serif; font-size: clamp(56px, 9vw, 96px); line-height: 0.92; letter-spacing: -2px; color: var(--white); margin-bottom: 24px; }
  .hero-title .outline { -webkit-text-stroke: 3px var(--white); color: transparent; }
  .hero-title .orange { color: var(--orange); }
  .hero-sub { font-size: 15px; color: #888; max-width: 520px; line-height: 1.7; border-left: 4px solid var(--orange); padding-left: 16px; }
  .hero-stats { display: flex; gap: 0; margin-top: 40px; }
  .hero-stat { border: var(--border); padding: 16px 24px; margin-left: -3px; }
  .hero-stat:first-child { margin-left: 0; }
  .hero-stat-value { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: var(--orange); line-height: 1; }
  .hero-stat-label { font-family: 'Space Mono', monospace; font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .bitcoin-bar { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border: var(--border); border-top: none; background: rgba(247,147,26,0.05); }
  .bitcoin-dot { width: 8px; height: 8px; background: var(--orange); animation: blink 1.2s step-end infinite; flex-shrink: 0; }
  .bitcoin-bar-text { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--orange); letter-spacing: 0.5px; }
  .tabs { display: flex; gap: 0; margin: 40px 0 0; }
  .tab { flex: 1; padding: 14px 10px; background: transparent; border: var(--border); margin-left: -3px; color: #555; font-family: 'Archivo Black', sans-serif; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.1s; }
  .tab:first-child { margin-left: 0; }
  .tab:hover:not(.active) { background: #1a1a1a; color: var(--white); }
  .tab.active { background: var(--orange); color: #000; border-color: var(--orange); box-shadow: var(--shadow-orange); position: relative; z-index: 1; }
  .card { border: var(--border); border-top: none; padding: 36px; background: #0f0f0f; box-shadow: var(--shadow); }
  .card-header { margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #1a1a1a; }
  .card-title { font-family: 'Archivo Black', sans-serif; font-size: 32px; letter-spacing: -1px; color: var(--white); line-height: 1; margin-bottom: 8px; }
  .card-desc { font-family: 'Space Mono', monospace; font-size: 11px; color: #555; line-height: 1.8; }
  .drop-zone { border: 3px dashed #333; padding: 56px 32px; text-align: center; cursor: pointer; transition: all 0.15s; position: relative; background: #080808; }
  .drop-zone:hover, .drop-zone.drag { border-color: var(--orange); border-style: solid; background: rgba(247,147,26,0.03); box-shadow: inset 0 0 0 1px var(--orange); }
  .drop-icon { font-size: 40px; margin-bottom: 16px; display: block; }
  .drop-title { font-family: 'Archivo Black', sans-serif; font-size: 18px; margin-bottom: 8px; color: var(--white); letter-spacing: -0.5px; }
  .drop-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: #444; letter-spacing: 1px; }
  .drop-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .file-info { margin-top: 20px; border: var(--border); background: #080808; }
  .file-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-bottom: 2px solid #1a1a1a; }
  .file-row:last-child { border-bottom: none; }
  .file-label { font-family: 'Space Mono', monospace; font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px; }
  .file-value { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--white); word-break: break-all; text-align: right; max-width: 60%; }
  .hash-display { margin-top: 20px; border: 3px solid var(--orange); padding: 18px 20px; background: rgba(247,147,26,0.03); }
  .hash-label { font-family: 'Space Mono', monospace; font-size: 9px; color: var(--orange); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
  .hash-value { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--orange); word-break: break-all; line-height: 1.7; }
  .meta-section { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .input-group { display: flex; flex-direction: column; gap: 0; border: var(--border); margin-left: -3px; margin-top: -3px; }
  .input-group:first-child { margin-left: 0; }
  .input-group.full { grid-column: 1 / -1; margin-left: 0; }
  .input-label { font-family: 'Space Mono', monospace; font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 2px; padding: 8px 14px 0; }
  .input-field { background: transparent; border: none; padding: 8px 14px 12px; color: var(--white); font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500; outline: none; width: 100%; transition: background 0.1s; }
  .input-field:focus { background: rgba(247,147,26,0.04); }
  .input-field option { background: #0f0f0f; color: var(--white); }
  .anchor-btn { margin-top: 24px; width: 100%; padding: 18px; background: var(--orange); color: #000; border: var(--border); font-family: 'Archivo Black', sans-serif; font-size: 15px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; box-shadow: var(--shadow-orange); transition: all 0.1s; }
  .anchor-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 8px 8px 0px var(--orange-dark); }
  .anchor-btn:active:not(:disabled) { transform: translate(4px, 4px); box-shadow: none; }
  .anchor-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
  .copy-btn { background: transparent; border: 2px solid #333; color: #555; font-family: 'Space Mono', monospace; font-size: 9px; padding: 5px 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.1s; }
  .copy-btn:hover { border-color: var(--white); color: var(--white); box-shadow: var(--shadow-sm); }
  .copy-btn.orange { border-color: rgba(247,147,26,0.5); color: var(--orange); }
  .copy-btn.orange:hover { border-color: var(--orange); box-shadow: 3px 3px 0px var(--orange); }
  .success-card { margin-top: 20px; padding: 28px; border: 3px solid var(--green); background: rgba(0,255,136,0.03); text-align: center; box-shadow: 6px 6px 0px var(--green); }
  .success-icon { font-size: 36px; margin-bottom: 12px; display: block; }
  .success-title { font-family: 'Archivo Black', sans-serif; font-size: 24px; color: var(--green); letter-spacing: -0.5px; margin-bottom: 6px; }
  .success-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: #444; letter-spacing: 1px; }
  .verify-result { margin-top: 20px; padding: 28px; text-align: center; }
  .verify-result.found { border: 3px solid var(--green); background: rgba(0,255,136,0.03); box-shadow: 6px 6px 0px var(--green); }
  .verify-result.not-found { border: 3px solid var(--red); background: rgba(255,51,51,0.03); box-shadow: 6px 6px 0px var(--red); }
  .verify-icon { font-size: 40px; margin-bottom: 12px; display: block; }
  .verify-status { font-family: 'Archivo Black', sans-serif; font-size: 32px; letter-spacing: -1px; margin-bottom: 20px; }
  .verify-status.ok { color: var(--green); }
  .verify-status.fail { color: var(--red); }
  .verify-detail { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #1a1a1a; text-align: left; }
  .verify-detail-label { font-family: 'Space Mono', monospace; font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px; }
  .verify-detail-value { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--white); }
  .records-list { display: flex; flex-direction: column; gap: 0; }
  .timeline-year { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--orange); text-transform: uppercase; letter-spacing: 3px; padding: 16px 0 12px; border-bottom: 2px solid #1a1a1a; }
  .record-card { border: var(--border); border-top: none; padding: 20px; transition: background 0.1s; }
  .record-card:hover { background: #111; }
  .record-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .record-type-badge { font-family: 'Space Mono', monospace; font-size: 9px; background: var(--orange); color: #000; padding: 3px 8px; text-transform: uppercase; letter-spacing: 1px; }
  .record-name { font-family: 'Archivo Black', sans-serif; font-size: 16px; color: var(--white); letter-spacing: -0.3px; }
  .record-block { font-family: 'Space Mono', monospace; font-size: 10px; color: #444; }
  .record-hash { font-family: 'Space Mono', monospace; font-size: 9px; color: #333; margin-top: 10px; word-break: break-all; letter-spacing: 0.5px; }
  .record-owner { font-family: 'Space Mono', monospace; font-size: 9px; color: #444; margin-top: 4px; letter-spacing: 0.5px; }
  .empty-state { text-align: center; padding: 72px 20px; border: 3px dashed #222; }
  .empty-icon { font-size: 40px; margin-bottom: 16px; display: block; opacity: 0.3; }
  .empty-text { font-family: 'Archivo Black', sans-serif; font-size: 20px; color: #333; letter-spacing: -0.5px; margin-bottom: 8px; }
  .empty-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: #2a2a2a; letter-spacing: 1px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
  .modal { background: #0f0f0f; border: var(--border); padding: 36px; width: 100%; max-width: 440px; box-shadow: var(--shadow); }
  .modal-title { font-family: 'Archivo Black', sans-serif; font-size: 28px; letter-spacing: -1px; margin-bottom: 8px; color: var(--white); }
  .modal-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: #444; margin-bottom: 24px; line-height: 1.8; letter-spacing: 0.5px; }
  .cred-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-bottom: 16px; }
  .cred-option { padding: 12px; background: #080808; border: var(--border); margin-left: -3px; margin-top: -3px; font-family: 'Space Mono', monospace; font-size: 10px; color: #444; cursor: pointer; transition: all 0.1s; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
  .cred-option:first-child, .cred-option:nth-child(2) { margin-top: 0; }
  .cred-option:nth-child(odd) { margin-left: 0; }
  .cred-option:hover, .cred-option.selected { background: var(--orange); color: #000; border-color: var(--orange); z-index: 1; position: relative; }
  .modal-actions { display: flex; gap: 0; margin-top: 20px; }
  .modal-cancel { flex: 1; padding: 14px; background: transparent; border: var(--border); color: #444; font-family: 'Archivo Black', sans-serif; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.1s; }
  .modal-cancel:hover { background: #1a1a1a; color: var(--white); }
  .modal-confirm { flex: 2; padding: 14px; background: var(--orange); border: var(--border); border-left: none; color: #000; font-family: 'Archivo Black', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; box-shadow: var(--shadow-orange); transition: all 0.1s; }
  .modal-confirm:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 8px 8px 0px var(--orange-dark); }
  .modal-confirm:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 14px 24px; font-family: 'Space Mono', monospace; font-size: 12px; z-index: 200; display: flex; align-items: center; gap: 12px; animation: slideup 0.2s ease; white-space: nowrap; letter-spacing: 0.5px; border: var(--border); }
  .toast.success { background: #0a0a0a; border-color: var(--green); color: var(--green); box-shadow: 4px 4px 0px var(--green); }
  .toast.error { background: #0a0a0a; border-color: var(--red); color: var(--red); box-shadow: 4px 4px 0px var(--red); }
  .toast.info { background: #0a0a0a; border-color: var(--orange); color: var(--orange); box-shadow: 4px 4px 0px var(--orange); }
  @keyframes slideup { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .wallet-btn { background: transparent; border: var(--border); color: var(--white); padding: 10px 18px; font-family: 'Space Mono', monospace; font-size: 10px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.1s; height: 40px; }
  .wallet-btn:hover { background: var(--white); color: #000; box-shadow: var(--shadow-sm); }
  .wallet-btn.connected { border-color: var(--green); color: var(--green); }
  @media (max-width: 640px) { .hero-title { font-size: 52px; } .meta-section { grid-template-columns: 1fr; } .hero-stats { flex-wrap: wrap; } .logo-sub { display: none; } }
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
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

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
    anchorDocument(hash, title || file.name, docType,
      (txId) => {
        setRecords(prev => [{ id: Date.now(), title: title || file.name, type: docType, hash, owner: walletAddress, block: "pending", year: new Date().getFullYear(), txId }, ...prev]);
        setAnchoring(false);
        setAnchored(true);
      },
      (err) => { console.error(err); setAnchoring(false); }
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
    recs.forEach(r => { if (!grouped[r.year]) grouped[r.year] = []; grouped[r.year].push(r); });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">₿</div>
            <div className="logo-text">ProofLedger</div>
            <div className="logo-sub">Bitcoin Native</div>
          </div>
          <div className="header-right">
            <WalletButton onConnect={setWalletAddress} onDisconnect={() => setWalletAddress(null)} />
            {walletAddress && <a href={"/profile/" + walletAddress} className="nav-link orange">Profile</a>}
            {walletAddress && <a href={"/cv/" + walletAddress} className="nav-link">CV</a>}
          </div>
        </header>

        <div className="hero">
          <div className="hero-tag"><div className="hero-dot" />Stacks Mainnet · Live on Bitcoin</div>
          <div className="hero-title">PROOF<br /><span className="outline">OF</span><br /><span className="orange">EVERYTHING</span></div>
          <div className="hero-sub">Anchor any document to Bitcoin. Permanent, verifiable, unstoppable. Your credentials live on-chain forever.</div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-value">BTC</div><div className="hero-stat-label">Secured by</div></div>
            <div className="hero-stat"><div className="hero-stat-value">SHA-256</div><div className="hero-stat-label">Hash standard</div></div>
            <div className="hero-stat"><div className="hero-stat-value">0</div><div className="hero-stat-label">Upload required</div></div>
            <div className="hero-stat"><div className="hero-stat-value">Forever</div><div className="hero-stat-label">On-chain proof</div></div>
          </div>
        </div>

        <div className="bitcoin-bar">
          <div className="bitcoin-dot" />
          <span className="bitcoin-bar-text">Stacks mainnet · Anchored to Bitcoin · 3 contracts deployed</span>
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
            <div className="card-header">
              <div className="card-title">Anchor to Bitcoin</div>
              <div className="card-desc">Upload any file. SHA-256 hash stored on Stacks. Your document stays private. Only the proof goes on-chain.</div>
            </div>
            <div className={`drop-zone ${drag ? "drag" : ""}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop} onClick={() => fileRef.current.click()}>
              <input ref={fileRef} type="file" className="drop-input" onChange={e => onFileSelect(e.target.files[0])} />
              {!file ? (<><span className="drop-icon">⬆</span><div className="drop-title">Drop your file here</div><div className="drop-sub">PDF · JPG · PNG · DOCX · any format</div></>) : (<><span className="drop-icon">📄</span><div className="drop-title">{file.name}</div><div className="drop-sub">{formatSize(file.size)} · Click to change</div></>)}
            </div>
            {file && (<div className="file-info"><div className="file-row"><span className="file-label">Filename</span><span className="file-value">{file.name}</span></div><div className="file-row"><span className="file-label">Size</span><span className="file-value">{formatSize(file.size)}</span></div><div className="file-row"><span className="file-label">Modified</span><span className="file-value">{new Date(file.lastModified).toLocaleDateString()}</span></div></div>)}
            {hashing && (<div className="hash-display" style={{ textAlign: "center" }}><div className="hash-label">Generating SHA-256 hash...</div></div>)}
            {hash && !hashing && (<div className="hash-display"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div className="hash-label">SHA-256 Hash</div><button className="copy-btn" onClick={() => copyHash(hash)}>{copied ? "Copied!" : "Copy"}</button></div><div className="hash-value">{hash}</div></div>)}
            {hash && (<div className="meta-section"><div className="input-group full"><label className="input-label">Document Title</label><input className="input-field" placeholder="e.g. Computer Science Diploma 2026" value={title} onChange={e => setTitle(e.target.value)} /></div><div className="input-group"><label className="input-label">Document Type</label><select className="input-field" value={docType} onChange={e => setDocType(e.target.value)}><option value="diploma">Diploma</option><option value="research">Research Paper</option><option value="art">Artwork</option><option value="contract">Contract</option><option value="identity">Identity</option><option value="other">Other</option></select></div><div className="input-group"><label className="input-label">IPFS Link (optional)</label><input className="input-field" placeholder="ipfs://Qm..." /></div></div>)}
            <button className="anchor-btn" disabled={!hash || anchoring || anchored || !walletAddress} onClick={onAnchor}>
              {anchoring ? <><span className="spinner" />Anchoring to Bitcoin...</> : anchored ? "Anchored to Bitcoin" : !walletAddress ? "Connect Wallet First" : "Anchor to Bitcoin"}
            </button>
            {anchored && (<div className="success-card"><span className="success-icon">✓</span><div className="success-title">Anchored to Bitcoin</div><div className="success-sub">Your proof is permanent. Bitcoin secures it now.</div></div>)}
          </div>
        )}

        {tab === "verify" && (
          <div className="card">
            <div className="card-header"><div className="card-title">Verify Document</div><div className="card-desc">Upload any document to check if it was anchored on-chain. The original file never leaves your device.</div></div>
            <div className={`drop-zone ${drag ? "drag" : ""}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); onVerifyFile(e.dataTransfer.files[0]); }} onClick={() => document.getElementById("vfile").click()}>
              <input id="vfile" type="file" className="drop-input" onChange={e => onVerifyFile(e.target.files[0])} />
              {!verifyFile ? (<><span className="drop-icon">🔍</span><div className="drop-title">Drop document to verify</div><div className="drop-sub">Hash computed locally. Nothing uploaded.</div></>) : (<><span className="drop-icon">📄</span><div className="drop-title">{verifyFile.name}</div><div className="drop-sub">{formatSize(verifyFile.size)}</div></>)}
            </div>
            {verifyHash && (<div className="hash-display" style={{ marginTop: 20 }}><div className="hash-label">Computed Hash</div><div className="hash-value">{verifyHash}</div></div>)}
            {verifyHash && (<button className="anchor-btn" onClick={onVerify} disabled={verifying}>{verifying ? <><span className="spinner" />Checking on-chain...</> : "Check On-Chain"}</button>)}
            {verifyResult !== null && !verifying && (
              <div className={`verify-result ${verifyResult ? "found" : "not-found"}`}>
                <span className="verify-icon">{verifyResult ? "✓" : "✗"}</span>
                <div className={`verify-status ${verifyResult ? "ok" : "fail"}`}>{verifyResult ? "Verified on Bitcoin" : "Not found on chain"}</div>
                {verifyResult && (<><div className="verify-detail"><span className="verify-detail-label">Title</span><span className="verify-detail-value">{verifyResult.title}</span></div><div className="verify-detail"><span className="verify-detail-label">Owner</span><span className="verify-detail-value">{verifyResult.owner.slice(0,10)}...{verifyResult.owner.slice(-6)}</span></div><div className="verify-detail"><span className="verify-detail-label">Block Height</span><span className="verify-detail-value">{verifyResult.block.toLocaleString()}</span></div><div className="verify-detail"><span className="verify-detail-label">Type</span><span className="verify-detail-value">{verifyResult.docType}</span></div></>)}
              </div>
            )}
          </div>
        )}

        {tab === "records" && (
          <div className="card">
            <div className="card-header"><div className="card-title">My Records</div><div className="card-desc">Your Bitcoin-backed achievement ledger. Every entry is permanent.</div></div>
            {records.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">📭</span><div className="empty-text">No records yet</div><div className="empty-sub">Anchor your first document to get started</div></div>
            ) : (
              <div className="records-list">
                {groupByYear(records).map(([year, recs]) => (
                  <div key={year}>
                    <div className="timeline-year">{year}</div>
                    {recs.map(r => (
                      <div key={r.id} className="record-card">
                        <div className="record-top">
                          <div><div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 6 }}><span className="record-type-badge">{r.type}</span><span className="record-name" style={{ marginLeft: 10 }}>{r.title}</span></div><div className="record-owner">Owner: {r.owner.slice(0,10)}...{r.owner.slice(-6)}</div></div>
                          <div style={{ textAlign: "right" }}><div className="record-block">Block #{r.block.toLocaleString()}</div><button className="copy-btn" style={{ marginTop: 8 }} onClick={() => copyHash(r.hash)}>Copy hash</button></div>
                        </div>
                        <div className="record-hash">SHA-256: {r.hash.slice(0,32)}...</div>
                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="copy-btn" onClick={() => setAttestModal(r)}>+ Attest</button>
                          <button className="copy-btn orange" onClick={() => { const meta = getAchievementMeta(r.type); mintAchievement(r.hash, r.type, r.title, () => showToast(meta.icon + " NFT minted successfully"), () => showToast("Mint cancelled", "error")); }}>{getAchievementMeta(r.type).icon} Mint NFT</button>
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
            <div className="modal-sub">You are signing this document as a verified issuer. Your wallet address will be permanently tied to this credential.</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Credential Type</div>
            <div className="cred-options">
              {["degree", "employment", "certificate", "research", "contribution", "award", "identity", "other"].map(opt => (
                <div key={opt} className={`cred-option ${credType === opt ? "selected" : ""}`} onClick={() => setCredType(opt)}>{opt}</div>
              ))}
            </div>
            <input className="input-field" style={{ border: "var(--border)", padding: "12px 14px", marginTop: 8 }} placeholder="Or type a custom credential..." value={credType} onChange={e => setCredType(e.target.value)} />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setAttestModal(null); setCredType(""); }}>Cancel</button>
              <button className="modal-confirm" disabled={!credType || attesting} onClick={() => { setAttesting(true); attestDocument(attestModal.hash, credType.slice(0, 50), () => { setAttesting(false); setAttestModal(null); setCredType(""); showToast("Attestation submitted to Bitcoin"); }, () => { setAttesting(false); showToast("Cancelled", "error"); }); }}>{attesting ? "Submitting..." : "Sign Credential"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && (<div className={`toast ${toast.type}`}>{toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "●"}{toast.message}</div>)}
    </>
  );
}
