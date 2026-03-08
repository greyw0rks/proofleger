"use client";

import { useState, useEffect, use } from "react";
import { getWalletProfile, getDocumentAttestations, getWalletAchievements, getAchievementMeta, computeReputation, getTier } from "@/lib/wallet";

const ORANGE = "#F7931A";
const DARK = "#0a0a0a";
const CARD = "#111111";
const BORDER = "#1e1e1e";
const TEXT = "#e8e8e8";
const MUTED = "#666";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #e8e8e8; font-family: 'Syne', sans-serif; min-height: 100vh; }
  .page { max-width: 700px; margin: 0 auto; padding: 48px 24px 80px; }
  .back { font-size: 12px; font-family: 'Space Mono', monospace; color: #666; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 48px; transition: color 0.2s; }
  .back:hover { color: #F7931A; }
  .profile-header { margin-bottom: 48px; }
  .profile-avatar { width: 64px; height: 64px; background: #F7931A; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px; }
  .profile-address { font-size: 13px; font-family: 'Space Mono', monospace; color: #666; margin-bottom: 8px; word-break: break-all; }
  .profile-stats { display: flex; gap: 24px; margin-top: 16px; }
  .stat { display: flex; flex-direction: column; gap: 4px; }
  .stat-value { font-size: 24px; font-weight: 800; color: #F7931A; }
  .stat-label { font-size: 11px; font-family: 'Space Mono', monospace; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  .section-title { font-size: 11px; font-family: 'Space Mono', monospace; color: #F7931A; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
  .doc-list { display: flex; flex-direction: column; gap: 12px; }
  .doc-card { background: #111111; border: 1px solid #1e1e1e; border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
  .doc-card:hover { border-color: #333; }
  .doc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .doc-title { font-size: 15px; font-weight: 600; }
  .doc-badge { font-size: 10px; font-family: 'Space Mono', monospace; background: rgba(247,147,26,0.12); color: #F7931A; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
  .doc-block { font-size: 11px; font-family: 'Space Mono', monospace; color: #666; }
  .doc-verified { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 11px; font-family: 'Space Mono', monospace; color: #22c55e; }
  .bitcoin-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
  .share-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(247,147,26,0.05); border: 1px solid rgba(247,147,26,0.1); border-radius: 10px; margin-bottom: 40px; }
  .share-url { font-size: 12px; font-family: 'Space Mono', monospace; color: #F7931A; }
  .copy-btn { background: transparent; border: 1px solid #1e1e1e; color: #666; font-size: 10px; font-family: 'Space Mono', monospace; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .copy-btn:hover { border-color: #F7931A; color: #F7931A; }
  .loading { text-align: center; padding: 80px 20px; color: #666; font-family: 'Space Mono', monospace; font-size: 13px; }
  .empty { text-align: center; padding: 80px 20px; }
  .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.3; }
  .empty-text { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
  .empty-sub { font-size: 13px; font-family: 'Space Mono', monospace; color: #666; }
  .verified-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-family: 'Space Mono', monospace; color: #22c55e; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); padding: 4px 10px; border-radius: 6px; margin-top: 12px; }
.rep-card { background: #111111; border: 1px solid #1e1e1e; border-radius: 14px; padding: 28px; margin-bottom: 32px; }
.rep-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.rep-score { font-size: 56px; font-weight: 800; line-height: 1; }
.rep-tier { font-size: 12px; font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; }
.rep-bar-wrap { background: #0d0d0d; border-radius: 999px; height: 6px; margin-bottom: 24px; overflow: hidden; }
.rep-bar { height: 6px; border-radius: 999px; transition: width 1s ease; }
.rep-breakdown { display: flex; flex-direction: column; gap: 10px; }
.rep-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #0d0d0d; border-radius: 8px; }
.rep-row-label { font-size: 13px; font-weight: 600; }
.rep-row-reason { font-size: 11px; font-family: 'Space Mono', monospace; color: #666; margin-top: 2px; }
.rep-row-points { font-size: 14px; font-weight: 700; color: #F7931A; font-family: 'Space Mono', monospace; }
.tier-badge { padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 1px; }
`;

export default function ProfilePage({ params }) {
  const { wallet } = use(params);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

 useEffect(() => {
  if (!wallet) return;
  computeReputation(wallet).then(setReputation);
  getWalletAchievements(wallet).then(setAchievements);
  getWalletProfile(wallet).then(async (results) => {
    const docsWithAtts = await Promise.all(
      results.map(async (doc) => {
        const attestations = doc.hash
          ? await getDocumentAttestations(doc.hash)
          : [];
        return { ...doc, attestations };
      })
    );
    setDocs(docsWithAtts);
    setLoading(false);
  });
}, [wallet]);


  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shortWallet = wallet ? `${wallet.slice(0, 8)}...${wallet.slice(-6)}` : "";
const [achievements, setAchievements] = useState([]);
const [reputation, setReputation] = useState(null);
  const docTypes = [...new Set(docs.map(d => d.docType))];

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <a href="/" className="back">← Back to ProofLedger</a>

        {loading ? (
          <div className="loading">Loading proof profile...</div>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-avatar">🔐</div>
              <div className="profile-address">{wallet}</div>
              <div className="verified-badge">
                <div className="bitcoin-dot" />
                Verified on Bitcoin
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <div className="stat-value">{docs.length}</div>
                  <div className="stat-label">Proofs</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{docTypes.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
                {docs.length > 0 && (
                  <div className="stat">
                    <div className="stat-value">{Math.min(...docs.map(d => parseInt(d.block))).toLocaleString()}</div>
                    <div className="stat-label">First Block</div>
                  </div>
                )}
              </div>
            </div>

            <div className="share-bar">
              <span className="share-url">{typeof window !== "undefined" ? window.location.href : ""}</span>
             <div style={{ display: "flex", gap: 8 }}>
  <button className="copy-btn" onClick={copyUrl}>
    {copied ? "Copied!" : "Copy Link"}
  </button>
  <a href={"/cv/" + wallet} style={{ textDecoration: "none" }}>
    <button className="copy-btn" style={{ color: "#F7931A", borderColor: "rgba(247,147,26,0.3)" }}>
      View CV
    </button>
  </a>
</div>
            </div>
{reputation && (
  <div className="rep-card">
    <div className="rep-top">
      <div>
        <div className="section-title" style={{ marginBottom: 8 }}>Reputation Score</div>
        <div className="rep-score" style={{ color: reputation.tier.color }}>
          {reputation.score}
        </div>
        <div className="rep-tier" style={{ color: reputation.tier.color }}>
          {reputation.tier.label}
        </div>
      </div>
      <div
        className="tier-badge"
        style={{
          background: reputation.tier.color + "20",
          color: reputation.tier.color,
          border: "1px solid " + reputation.tier.color + "40",
        }}
      >
        {reputation.tier.label}
      </div>
    </div>
    <div className="rep-bar-wrap">
      <div
        className="rep-bar"
        style={{
          width: Math.min((reputation.score / 1000) * 100, 100) + "%",
          background: reputation.tier.color,
        }}
      />
    </div>
    {reputation.breakdown.length > 0 && (
      <div className="rep-breakdown">
        {reputation.breakdown.map((item, i) => (
          <div key={i} className="rep-row">
            <div>
              <div className="rep-row-label">{item.label}</div>
              <div className="rep-row-reason">{item.reason}</div>
            </div>
            <div className="rep-row-points">+{item.points}</div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
            {docs.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <div className="empty-text">No proofs found</div>
                <div className="empty-sub">This wallet has no anchored documents</div>
              </div>
            ) : (
              <>
{achievements.length > 0 && (
  <>
    <div className="section-title" style={{ marginTop: 40 }}>Soulbound NFTs</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
      {achievements.map((a, i) => {
        const meta = getAchievementMeta(
          ["diploma","research","art","certificate","contribution","award"]
            .find(k => a.achievementType.toLowerCase().includes(k)) || "other"
        );
        return (
          <div key={i} style={{ background: "#111111", border: "1px solid rgba(247,147,26,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
            <div style={{ fontSize: 32 }}>{meta.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{a.achievementType}</div>
              <div style={{ fontSize: 11, fontFamily: "Space Mono", color: "#666" }}>{a.title}</div>
              <div style={{ fontSize: 10, fontFamily: "Space Mono", color: "#F7931A", marginTop: 4 }}>Block #{parseInt(a.mintedAt).toLocaleString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  </>
)}
                <div className="section-title">Verified Achievements</div>
                <div className="doc-list">
                  {docs.map((doc, i) => (
                    <div key={i} className="doc-card">
                      <div className="doc-top">
                        <div className="doc-title">{doc.title}</div>
                        <div className="doc-badge">{doc.docType}</div>
                      </div>
                      <div className="doc-block">Bitcoin Block #{parseInt(doc.block).toLocaleString()}</div>
                      <div className="doc-verified">
  <div className="bitcoin-dot" />
  Anchored to Bitcoin
</div>
{doc.attestations && doc.attestations.length > 0 && (
  <div style={{ marginTop: 12, borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
    <div style={{ fontSize: 10, fontFamily: "Space Mono", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
      Verified by
    </div>
    {doc.attestations.map((att, j) => (
      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 6, height: 6, background: "#F7931A", borderRadius: "50%" }} />
        <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "#e8e8e8" }}>
          {att.issuer.slice(0, 8)}...{att.issuer.slice(-6)}
        </span>
        <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#F7931A", background: "rgba(247,147,26,0.1)", padding: "2px 6px", borderRadius: 3 }}>
          {att.credentialType}
        </span>
      </div>
    ))}
  </div>
)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
