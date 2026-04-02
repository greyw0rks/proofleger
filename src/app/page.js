"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import { useMiniPay } from "@/hooks/useMiniPay";
import { isWalletConnected, getAddress, anchorDocument, verifyDocument, attestDocument, mintAchievement, getAchievementMeta } from "@/lib/wallet";
import { anchorDocumentCelo, verifyDocumentCelo, attestDocumentCelo, CELO_EXPLORER } from "@/lib/wallet-celo";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --black: #0a0a0a;
    --white: #f5f0e8;
    --orange: #F7931A;
    --orange-dark: #d4780f;
    --green: #00ff88;
    --celo-green: #35D07F;
    --celo-yellow: #FCFF52;
    --red: #ff3333;
    --border: 3px solid #f5f0e8;
    --shadow: 6px 6px 0px #f5f0e8;
    --shadow-orange: 6px 6px 0px #F7931A;
    --shadow-sm: 3px 3px 0px #f5f0e8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
  }

  ::selection { background: var(--orange); color: #000; }

  .app { max-width: 960px; margin: 0 auto; padding: 0 24px 100px; }

  .header {
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border);
    margin-bottom: 0;
  }

  .logo { display: flex; align-items: center; gap: 12px; }
  .logo-box {
    width: 40px; height: 40px;
    border: 3px solid var(--white);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    box-shadow: 3px 3px 0px var(--orange);
  }
  .logo-text { font-family: 'Archivo Black', sans-serif; font-size: 20px; letter-spacing: 1px; }
  .logo-text span { color: var(--orange); }

  .hero {
    padding: 48px 0 32px;
    border-bottom: var(--border);
  }
  .hero-tag {
    display: inline-block;
    border: 2px solid var(--orange);
    color: var(--orange);
    padding: 4px 12px;
    font-size: 11px;
    font-family: 'Archivo Black', sans-serif;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(32px, 6vw, 56px);
    line-height: 1.05;
    letter-spacing: -1px;
    margin-bottom: 16px;
  }
  .hero h1 .outline {
    -webkit-text-stroke: 2px var(--white);
    color: transparent;
  }
  .hero p {
    font-size: 16px;
    color: #999;
    max-width: 500px;
    line-height: 1.6;
  }

  .network-bar {
    padding: 20px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .network-label {
    font-size: 11px;
    color: #666;
    font-family: 'Space Mono', monospace;
    letter-spacing: 1px;
  }

  .celo-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 2px solid var(--celo-green);
    color: var(--celo-green);
    padding: 3px 10px;
    font-size: 11px;
    font-family: 'Archivo Black', sans-serif;
    letter-spacing: 1px;
  }

  .tabs-row {
    display: flex;
    margin-top: 32px;
    border-bottom: none;
  }
  .tab-btn {
    padding: 12px 28px;
    border: 3px solid var(--white);
    border-bottom: none;
    background: transparent;
    color: #666;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 1px;
    margin-right: -3px;
  }
  .tab-btn.active {
    background: var(--orange);
    color: var(--black);
    border-color: var(--orange);
    position: relative;
    z-index: 1;
  }

  .tab-panel {
    border: 3px solid var(--white);
    padding: 32px;
    box-shadow: var(--shadow);
    min-height: 300px;
  }

  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: #888;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    background: transparent;
    border: 3px solid var(--white);
    color: var(--white);
    padding: 12px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    outline: none;
  }
  .form-input:focus { border-color: var(--orange); }
  .form-select {
    width: 100%;
    background: var(--black);
    border: 3px solid var(--white);
    color: var(--white);
    padding: 12px 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    outline: none;
    cursor: pointer;
  }

  .file-drop {
    border: 3px dashed #444;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    margin-bottom: 20px;
  }
  .file-drop:hover { border-color: var(--orange); }
  .file-drop.active { border-color: var(--orange); border-style: solid; }

  .btn-primary {
    background: var(--orange);
    color: var(--black);
    border: 3px solid var(--orange);
    padding: 14px 32px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--orange-dark);
    letter-spacing: 1px;
    width: 100%;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .btn-primary:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0px var(--orange-dark); }
  .btn-primary:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--orange-dark); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-celo {
    background: var(--celo-green);
    border-color: var(--celo-green);
    box-shadow: 4px 4px 0px #259a5e;
  }
  .btn-celo:hover { box-shadow: 5px 5px 0px #259a5e; }

  .status-box {
    border: 3px solid;
    padding: 16px;
    margin-top: 20px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    word-break: break-all;
    line-height: 1.6;
  }
  .status-success { border-color: var(--green); color: var(--green); }
  .status-error   { border-color: var(--red); color: var(--red); }
  .status-info    { border-color: var(--white); color: var(--white); }

  .hash-display {
    background: #111;
    border: 2px solid #333;
    padding: 12px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--orange);
    word-break: break-all;
    margin-top: 8px;
  }

  .record-card {
    border: 3px solid var(--white);
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
  }
  .record-title { font-family: 'Archivo Black', sans-serif; font-size: 16px; margin-bottom: 8px; }
  .record-meta  { font-family: 'Space Mono', monospace; font-size: 11px; color: #888; line-height: 1.8; }
  .record-type  {
    display: inline-block;
    border: 2px solid var(--white);
    padding: 2px 8px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
    margin-bottom: 8px;
  }

  .minipay-banner {
    background: #0d1f16;
    border: 3px solid var(--celo-green);
    padding: 12px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--celo-green);
    font-family: 'Archivo Black', sans-serif;
  }

  .chain-pill {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
    border: 2px solid;
    margin-left: 8px;
    letter-spacing: 1px;
  }
  .chain-stacks { border-color: var(--orange); color: var(--orange); }
  .chain-celo   { border-color: var(--celo-green); color: var(--celo-green); }
`;

const DOC_TYPES = ["diploma","certificate","research","art","contribution","award","other"];

async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function Home() {
  const [network, setNetwork] = useState("stacks");
  const [tab, setTab] = useState("anchor");
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const [verifyHash, setVerifyHash] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  // Stacks wallet state
  const [stacksAddress, setStacksAddress] = useState(null);

  // Celo / MiniPay state
  const { isMiniPay, address: celoAddress, connected: celoConnected, connect: connectCelo } = useMiniPay();

  const activeAddress = network === "stacks" ? stacksAddress : celoAddress;
  const isConnected = network === "stacks" ? !!stacksAddress : celoConnected;

  useEffect(() => {
    const addr = getAddress();
    if (addr && isWalletConnected()) setStacksAddress(addr);
  }, []);

  // Auto-switch to Celo if inside MiniPay
  useEffect(() => {
    if (isMiniPay) setNetwork("celo");
  }, [isMiniPay]);

  async function handleFileChange(f) {
    if (!f) return;
    setFile(f);
    setStatus({ type: "info", msg: `Hashing ${f.name}...` });
    const h = await hashFile(f);
    setHash(h);
    setStatus({ type: "success", msg: `File hashed. Ready to anchor.` });
  }

  async function handleAnchor() {
    if (!isConnected) return setStatus({ type: "error", msg: "Connect your wallet first." });
    if (!hash) return setStatus({ type: "error", msg: "Select a file or enter a hash." });
    if (!title) return setStatus({ type: "error", msg: "Enter a document title." });
    setLoading(true);
    setStatus({ type: "info", msg: "Submitting to blockchain..." });
    try {
      if (network === "stacks") {
        await anchorDocument(hash, title, docType);
        setStatus({ type: "success", msg: `Anchored to Bitcoin via Stacks.\nHash: ${hash}` });
      } else {
        const txHash = await anchorDocumentCelo(hash, title, docType);
        setStatus({ type: "success", msg: `Anchored to Celo!\nTx: ${txHash}\n${CELO_EXPLORER}/tx/${txHash}` });
      }
    } catch (e) {
      setStatus({ type: "error", msg: e.message || "Transaction failed" });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!verifyHash.trim()) return setStatus({ type: "error", msg: "Enter a hash to verify." });
    setLoading(true);
    setStatus({ type: "info", msg: "Checking chain..." });
    try {
      let result;
      if (network === "stacks") {
        result = await verifyDocument(verifyHash.trim());
      } else {
        result = await verifyDocumentCelo(verifyHash.trim());
      }
      if (result) {
        setStatus({ type: "success", msg: `VERIFIED on ${network === "stacks" ? "Bitcoin/Stacks" : "Celo"}!\n\nTitle: ${result.title || "—"}\nType: ${result.docType || result["doc-type"] || "—"}\nOwner: ${result.owner}\nBlock: ${result.blockHeight || result["block-height"] || result.blockNumber || "—"}` });
      } else {
        setStatus({ type: "error", msg: "Document not found on chain." });
      }
    } catch (e) {
      setStatus({ type: "error", msg: e.message || "Verification failed" });
    } finally {
      setLoading(false);
    }
  }

  const isCelo = network === "celo";
  const accentColor = isCelo ? "var(--celo-green)" : "var(--orange)";

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <div className="logo-box">PL</div>
            <div className="logo-text">PROOF<span>LEDGER</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {network === "stacks" ? (
              <WalletButton onConnect={setStacksAddress} onDisconnect={() => setStacksAddress(null)} />
            ) : (
              celoConnected ? (
                <button style={{ border: "3px solid var(--celo-green)", background: "transparent", color: "var(--celo-green)", padding: "10px 16px", fontFamily: "Archivo Black, sans-serif", fontSize: "12px", cursor: "pointer" }}>
                  {celoAddress?.slice(0, 6)}...{celoAddress?.slice(-4)}
                </button>
              ) : (
                <button onClick={connectCelo} style={{ border: "3px solid var(--celo-green)", background: "var(--celo-green)", color: "#000", padding: "10px 20px", fontFamily: "Archivo Black, sans-serif", fontSize: "12px", cursor: "pointer", boxShadow: "3px 3px 0px #259a5e" }}>
                  {isMiniPay ? "CONNECTING..." : "CONNECT WALLET"}
                </button>
              )
            )}
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-tag">BITCOIN + CELO DOCUMENT PROOF</div>
          <h1>Anchor Documents<br/>to <span className="outline">Blockchain</span></h1>
          <p>SHA-256 hash your files client-side. Anchor the proof permanently. Verify existence without revealing content.</p>

          {/* NETWORK SWITCHER */}
          <div className="network-bar">
            <span className="network-label">NETWORK:</span>
            <NetworkSwitcher network={network} onChange={setNetwork} />
            {isMiniPay && (
              <span className="celo-badge">⚡ MiniPay Detected</span>
            )}
          </div>
        </section>

        {/* MINIPAY BANNER */}
        {isMiniPay && (
          <div className="minipay-banner">
            <span>⚡</span>
            <span>Running inside MiniPay — wallet auto-connected</span>
          </div>
        )}

        {/* TABS */}
        <div className="tabs-row">
          {["anchor","verify","records"].map(t => (
            <button key={t} className={`tab-btn${tab === t ? " active" : ""}`}
              onClick={() => { setTab(t); setStatus(null); }}
              style={tab === t ? { background: accentColor, borderColor: accentColor } : {}}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TAB PANEL */}
        <div className="tab-panel">

          {/* ANCHOR */}
          {tab === "anchor" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                Hash your document locally, then anchor the proof to{" "}
                <span className="chain-pill" style={{ borderColor: accentColor, color: accentColor }}>
                  {isCelo ? "CELO" : "STACKS"}
                </span>
              </p>

              {/* File drop */}
              <div className={`file-drop${dragging ? " active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => handleFileChange(e.target.files[0])} />
                <p style={{ fontFamily: "Archivo Black, sans-serif", fontSize: "14px", marginBottom: "8px" }}>
                  {file ? file.name : "DROP FILE OR CLICK TO SELECT"}
                </p>
                <p style={{ fontSize: "12px", color: "#666" }}>Never uploaded — hashed locally in your browser</p>
              </div>

              {hash && <div className="hash-display">{hash}</div>}

              <div className="form-group" style={{ marginTop: "20px" }}>
                <label className="form-label">DOCUMENT TITLE</label>
                <input className="form-input" placeholder="e.g. Bachelor of Science — MIT 2024" value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">DOCUMENT TYPE</label>
                <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              <button className={`btn-primary${isCelo ? " btn-celo" : ""}`}
                onClick={handleAnchor} disabled={loading || !hash || !title}>
                {loading ? "ANCHORING..." : `ANCHOR TO ${isCelo ? "CELO" : "BITCOIN"}`}
              </button>

              {status && (
                <div className={`status-box status-${status.type}`} style={{ whiteSpace: "pre-line" }}>
                  {status.msg}
                </div>
              )}
            </div>
          )}

          {/* VERIFY */}
          {tab === "verify" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                Enter a SHA-256 hash to verify it was anchored on{" "}
                <span className="chain-pill" style={{ borderColor: accentColor, color: accentColor }}>
                  {isCelo ? "CELO" : "STACKS"}
                </span>
              </p>

              <div className="form-group">
                <label className="form-label">SHA-256 HASH</label>
                <input className="form-input" placeholder="64 hex characters..." value={verifyHash} onChange={e => setVerifyHash(e.target.value)} />
              </div>

              <button className={`btn-primary${isCelo ? " btn-celo" : ""}`}
                onClick={handleVerify} disabled={loading || !verifyHash.trim()}>
                {loading ? "VERIFYING..." : `VERIFY ON ${isCelo ? "CELO" : "BITCOIN"}`}
              </button>

              {status && (
                <div className={`status-box status-${status.type}`} style={{ whiteSpace: "pre-line" }}>
                  {status.msg}
                </div>
              )}
            </div>
          )}

          {/* RECORDS */}
          {tab === "records" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                {isConnected
                  ? `Showing records for ${activeAddress?.slice(0, 6)}...${activeAddress?.slice(-4)} on ${isCelo ? "Celo" : "Stacks"}`
                  : "Connect your wallet to view your records."}
              </p>
              {records.length === 0 && isConnected && (
                <div style={{ border: "3px dashed #333", padding: "40px", textAlign: "center", color: "#555", fontFamily: "Archivo Black, sans-serif" }}>
                  NO RECORDS FOUND
                </div>
              )}
              {records.map((r, i) => (
                <div key={i} className="record-card">
                  <div className="record-type">{r.docType}</div>
                  <div className="record-title">{r.title}</div>
                  <div className="record-meta">
                    Block: {r.blockHeight || r.blockNumber}<br/>
                    Hash: {r.hash?.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
