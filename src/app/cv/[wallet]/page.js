"use client";

import { useState, useEffect, use } from "react";
import {
  getWalletProfile,
  getDocumentAttestations,
  getWalletAchievements,
  getAchievementMeta,
  computeReputation,
  getTier,
} from "@/lib/wallet";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #e8e8e8; font-family: 'Syne', sans-serif; min-height: 100vh; }
  .page { max-width: 780px; margin: 0 auto; padding: 48px 24px 80px; }
  .back { font-size: 12px; font-family: 'Space Mono', monospace; color: #666; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 40px; transition: color 0.2s; }
  .back:hover { color: #F7931A; }
  .cv-actions { display: flex; gap: 10px; margin-bottom: 40px; }
  .btn-outline { background: transparent; border: 1px solid #1e1e1e; color: #e8e8e8; padding: 10px 20px; border-radius: 8px; font-family: 'Space Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: #F7931A; color: #F7931A; }
  .btn-orange { background: #F7931A; border: none; color: #000; padding: 10px 20px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .btn-orange:hover { background: #ffaa33; }
  .cv-header { border-bottom: 1px solid #1e1e1e; padding-bottom: 32px; margin-bottom: 40px; }
  .cv-name { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .cv-wallet { font-size: 12px; font-family: 'Space Mono', monospace; color: #666; margin-bottom: 16px; word-break: break-all; }
  .cv-tier { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-family: 'Space Mono', monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .cv-stats { display: flex; gap: 32px; }
  .cv-stat-value { font-size: 22px; font-weight: 800; }
  .cv-stat-label { font-size: 10px; font-family: 'Space Mono', monospace; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
  .cv-section { margin-bottom: 48px; }
  .cv-section-title { font-size: 10px; font-family: 'Space Mono', monospace; color: #F7931A; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #1e1e1e; }
  .cv-item { display: flex; gap: 20px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #0d0d0d; }
  .cv-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cv-item-left { width: 120px; flex-shrink: 0; }
  .cv-item-type { font-size: 10px; font-family: 'Space Mono', monospace; color: #F7931A; text-transform: uppercase; letter-spacing: 1px; background: rgba(247,147,26,0.1); padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
  .cv-item-block { font-size: 10px; font-family: 'Space Mono', monospace; color: #444; }
  .cv-item-right { flex: 1; }
  .cv-item-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .cv-item-owner { font-size: 11px; font-family: 'Space Mono', monospace; color: #666; margin-bottom: 8px; }
  .cv-proof-link { font-size: 10px; font-family: 'Space Mono', monospace; color: #444; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: color 0.2s; }
  .cv-proof-link:hover { color: #F7931A; }
  .cv-attestors { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .cv-attestor { font-size: 10px; font-family: 'Space Mono', monospace; background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); padding: 3px 10px; border-radius: 4px; }
  .nft-grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .nft-item { display: flex; align-items: center; gap: 10px; background: #111111; border: 1px solid rgba(247,147,26,0.15); border-radius: 10px; padding: 12px 16px; }
  .nft-icon { font-size: 24px; }
  .nft-label { font-size: 12px; font-weight: 600; }
  .nft-block { font-size: 10px; font-family: 'Space Mono', monospace; color: #666; margin-top: 2px; }
  .verified-stamp { display: flex; align-items: center; gap: 6px; font-size: 10px; font-family: 'Space Mono', monospace; color: #22c55e; margin-top: 8px; }
  .green-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; }
  .loading { text-align: center; padding: 80px 20px; color: #666; font-family: 'Space Mono', monospace; }
  .rep-bar-wrap { background: #1e1e1e; border-radius: 999px; height: 4px; width: 200px; margin-top: 12px; overflow: hidden; }
  .rep-bar { height: 4px; border-radius: 999px; }
  @media print {
    body { background: #fff; color: #000; }
    .back, .cv-actions { display: none; }
    .cv-header { border-bottom: 1px solid #ddd; }
    .cv-section-title { color: #F7931A; border-bottom: 1px solid #ddd; }
    .cv-item { border-bottom: 1px solid #f0f0f0; }
    .cv-item-type { background: #fff3e0; }
    .nft-item { border: 1px solid #ddd; background: #fafafa; }
    .cv-proof-link { color: #888; }
    .btn-outline, .btn-orange { display: none; }
  }
`;

const CONTRACT_ADDRESS = "ST1SY1E599GN04XRD2DQBKV7E62HYBJR2CSC3MXNA";

export default function CVPage({ params }) {
  const { wallet } = use(params);
  const [docs, setDocs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    Promise.all([
      computeReputation(wallet),
      getWalletAchievements(wallet),
      getWalletProfile(wallet).then(async (results) => {
        return Promise.all(
          results.map(async (doc) => {
            const attestations = doc.hash
              ? await getDocumentAttestations(doc.hash)
              : [];
            return { ...doc, attestations };
          })
        );
      }),
    ]).then(([rep, achv, docsWithAtts]) => {
      setReputation(rep);
      setAchievements(achv);
      setDocs(docsWithAtts);
      setLoading(false);
    });
  }, [wallet]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const explorerUrl = (hash) =>
    "https://explorer.hiro.so/txid/" + hash + "?chain=testnet";

  const diplomaDocs = docs.filter(d => d.docType === "diploma");
  const researchDocs = docs.filter(d => d.docType === "research");
  const otherDocs = docs.filter(d => !["diploma", "research"].includes(d.docType));

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <a href={"/" } className="back">← Back to ProofLedger</a>

        {loading ? (
          <div className="loading">Building CV from Bitcoin...</div>
        ) : (
          <>
            <div className="cv-actions">
              <button className="btn-outline" onClick={copyUrl}>
                {copied ? "Copied!" : "Share CV"}
              </button>
              <button className="btn-outline" onClick={() => window.print()}>
                Print / Save PDF
              </button>
              <a href={"/profile/" + wallet} style={{ textDecoration: "none" }}>
                <button className="btn-outline">View Profile</button>
              </a>
            </div>

            <div className="cv-header">
              <div className="cv-name">
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
              </div>
              <div className="cv-wallet">{wallet}</div>
              {reputation && (
                <div
                  className="cv-tier"
                  style={{
                    background: reputation.tier.color + "15",
                    color: reputation.tier.color,
                    border: "1px solid " + reputation.tier.color + "30",
                  }}
                >
                  <span>⬡</span>
                  {reputation.tier.label} · {reputation.score} pts
                </div>
              )}
              {reputation && (
                <div className="rep-bar-wrap">
                  <div
                    className="rep-bar"
                    style={{
                      width: Math.min((reputation.score / 1000) * 100, 100) + "%",
                      background: reputation.tier.color,
                    }}
                  />
                </div>
              )}
              <div className="cv-stats" style={{ marginTop: 20 }}>
                <div>
                  <div className="cv-stat-value">{docs.length}</div>
                  <div className="cv-stat-label">Verified Proofs</div>
                </div>
                <div>
                  <div className="cv-stat-value">{achievements.length}</div>
                  <div className="cv-stat-label">NFT Achievements</div>
                </div>
                <div>
                  <div className="cv-stat-value">
                    {docs.reduce((sum, d) => sum + (d.attestations?.length || 0), 0)}
                  </div>
                  <div className="cv-stat-label">Attestations</div>
                </div>
              </div>
            </div>

            {diplomaDocs.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Education</div>
                {diplomaDocs.map((doc, i) => (
                  <div key={i} className="cv-item">
                    <div className="cv-item-left">
                      <div className="cv-item-type">{doc.docType}</div>
                      <div className="cv-item-block">Block<br />#{parseInt(doc.block).toLocaleString()}</div>
                    </div>
                    <div className="cv-item-right">
                      <div className="cv-item-title">{doc.title}</div>
                      <div className="cv-item-owner">{doc.owner.slice(0,10)}...{doc.owner.slice(-6)}</div>
                      {doc.attestations?.length > 0 && (
                        <div className="cv-attestors">
                          {doc.attestations.map((att, j) => (
                            <div key={j} className="cv-attestor">
                              ✓ {att.credentialType} · {att.issuer.slice(0,6)}...{att.issuer.slice(-4)}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="verified-stamp">
                        <div className="green-dot" />
                        Anchored to Bitcoin
                        {doc.hash && (
                          <a href={explorerUrl(doc.hash)} target="_blank" className="cv-proof-link" style={{ marginLeft: 8 }}>
                            View proof →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {researchDocs.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Research & Publications</div>
                {researchDocs.map((doc, i) => (
                  <div key={i} className="cv-item">
                    <div className="cv-item-left">
                      <div className="cv-item-type">{doc.docType}</div>
                      <div className="cv-item-block">Block<br />#{parseInt(doc.block).toLocaleString()}</div>
                    </div>
                    <div className="cv-item-right">
                      <div className="cv-item-title">{doc.title}</div>
                      <div className="cv-item-owner">{doc.owner.slice(0,10)}...{doc.owner.slice(-6)}</div>
                      {doc.attestations?.length > 0 && (
                        <div className="cv-attestors">
                          {doc.attestations.map((att, j) => (
                            <div key={j} className="cv-attestor">
                              ✓ {att.credentialType} · {att.issuer.slice(0,6)}...{att.issuer.slice(-4)}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="verified-stamp">
                        <div className="green-dot" />
                        Anchored to Bitcoin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {otherDocs.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Achievements & Contributions</div>
                {otherDocs.map((doc, i) => (
                  <div key={i} className="cv-item">
                    <div className="cv-item-left">
                      <div className="cv-item-type">{doc.docType}</div>
                      <div className="cv-item-block">Block<br />#{parseInt(doc.block).toLocaleString()}</div>
                    </div>
                    <div className="cv-item-right">
                      <div className="cv-item-title">{doc.title}</div>
                      <div className="cv-item-owner">{doc.owner.slice(0,10)}...{doc.owner.slice(-6)}</div>
                      {doc.attestations?.length > 0 && (
                        <div className="cv-attestors">
                          {doc.attestations.map((att, j) => (
                            <div key={j} className="cv-attestor">
                              ✓ {att.credentialType} · {att.issuer.slice(0,6)}...{att.issuer.slice(-4)}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="verified-stamp">
                        <div className="green-dot" />
                        Anchored to Bitcoin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {achievements.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Soulbound Achievements</div>
                <div className="nft-grid">
                  {achievements.map((a, i) => {
                    const meta = getAchievementMeta(
                      ["diploma","research","art","certificate","contribution","award"]
                        .find(k => a.achievementType.toLowerCase().includes(k)) || "other"
                    );
                    return (
                      <div key={i} className="nft-item">
                        <div className="nft-icon">{meta.icon}</div>
                        <div>
                          <div className="nft-label">{a.achievementType}</div>
                          <div className="nft-block">Block #{parseInt(a.mintedAt).toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 48, padding: "20px 0", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontFamily: "Space Mono", color: "#444" }}>
                Generated by ProofLedger · Secured by Bitcoin
              </div>
              <div style={{ fontSize: 11, fontFamily: "Space Mono", color: "#444" }}>
                proofledger.xyz
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
