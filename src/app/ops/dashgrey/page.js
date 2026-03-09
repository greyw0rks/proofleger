"use client";

import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACTS = ["proofleger3", "credentials", "achievements"];
const API = "https://api.hiro.so";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #e8e8e8; font-family: 'Syne', sans-serif; min-height: 100vh; }
  .page { max-width: 1100px; margin: 0 auto; padding: 48px 24px 80px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
  .title { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .subtitle { font-size: 12px; font-family: 'Space Mono', monospace; color: #666; margin-top: 4px; }
  .live-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; display: inline-block; margin-right: 6px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
  .live-label { font-size: 11px; font-family: 'Space Mono', monospace; color: #22c55e; display: flex; align-items: center; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
  .stat-card { background: #111111; border: 1px solid #1e1e1e; border-radius: 14px; padding: 24px; }
  .stat-label { font-size: 10px; font-family: 'Space Mono', monospace; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .stat-value { font-size: 36px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .stat-sub { font-size: 11px; font-family: 'Space Mono', monospace; color: #444; margin-top: 6px; }
  .section { margin-bottom: 40px; }
  .section-title { font-size: 10px; font-family: 'Space Mono', monospace; color: #F7931A; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #1e1e1e; }
  .contract-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .contract-card { background: #111111; border: 1px solid #1e1e1e; border-radius: 12px; padding: 20px; }
  .contract-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .contract-addr { font-size: 10px; font-family: 'Space Mono', monospace; color: #444; margin-bottom: 16px; word-break: break-all; }
  .contract-stat { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #0d0d0d; }
  .contract-stat:last-child { border-bottom: none; }
  .contract-stat-label { font-size: 11px; font-family: 'Space Mono', monospace; color: #666; }
  .contract-stat-value { font-size: 13px; font-weight: 700; font-family: 'Space Mono', monospace; color: #F7931A; }
  .tx-table { width: 100%; border-collapse: collapse; }
  .tx-table th { font-size: 10px; font-family: 'Space Mono', monospace; color: #666; text-transform: uppercase; letter-spacing: 1px; padding: 10px 14px; text-align: left; border-bottom: 1px solid #1e1e1e; }
  .tx-table td { font-size: 12px; font-family: 'Space Mono', monospace; padding: 12px 14px; border-bottom: 1px solid #0d0d0d; vertical-align: middle; }
  .tx-table tr:last-child td { border-bottom: none; }
  .tx-table tr:hover td { background: #111111; }
  .badge { padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-anchor { background: rgba(247,147,26,0.1); color: #F7931A; }
  .badge-attest { background: rgba(34,197,94,0.1); color: #22c55e; }
  .badge-mint { background: rgba(167,139,250,0.1); color: #a78bfa; }
  .badge-other { background: rgba(100,100,100,0.1); color: #666; }
  .tx-link { color: #444; text-decoration: none; transition: color 0.2s; }
  .tx-link:hover { color: #F7931A; }
  .wallets-list { display: flex; flex-direction: column; gap: 8px; }
  .wallet-row { display: flex; justify-content: space-between; align-items: center; background: #111111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 14px 18px; }
  .wallet-addr { font-size: 12px; font-family: 'Space Mono', monospace; }
  .wallet-stats { display: flex; gap: 20px; }
  .wallet-stat { text-align: right; }
  .wallet-stat-value { font-size: 13px; font-weight: 700; color: #F7931A; }
  .wallet-stat-label { font-size: 9px; font-family: 'Space Mono', monospace; color: #444; text-transform: uppercase; }
  .bar-wrap { background: #0d0d0d; border-radius: 8px; height: 120px; display: flex; align-items: flex-end; gap: 4px; padding: 8px; }
  .bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 4px; }
  .bar { background: #F7931A; border-radius: 4px 4px 0 0; width: 100%; transition: height 0.5s ease; min-height: 2px; }
  .bar-label { font-size: 8px; font-family: 'Space Mono', monospace; color: #444; }
  .chart-row { display: flex; justify-content: space-between; align-items: flex-end; height: 100%; width: 100%; }
  .loading { text-align: center; padding: 80px; color: #666; font-family: 'Space Mono', monospace; }
  .refresh-btn { background: transparent; border: 1px solid #1e1e1e; color: #666; padding: 8px 16px; border-radius: 8px; font-family: 'Space Mono', monospace; font-size: 11px; cursor: pointer; transition: all 0.2s; }
  .refresh-btn:hover { border-color: #F7931A; color: #F7931A; }
  .orange { color: #F7931A; }
  .green { color: #22c55e; }
  .purple { color: #a78bfa; }
  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .contract-grid { grid-template-columns: 1fr; }
  }
`;

function getBadgeClass(fnName) {
  if (!fnName) return "badge badge-other";
  if (fnName.includes("store")) return "badge badge-anchor";
  if (fnName.includes("attest")) return "badge badge-attest";
  if (fnName.includes("mint")) return "badge badge-mint";
  return "badge badge-other";
}

function getFnLabel(fnName) {
  if (!fnName) return "unknown";
  if (fnName.includes("store")) return "Anchor";
  if (fnName.includes("attest")) return "Attest";
  if (fnName.includes("mint")) return "Mint NFT";
  return fnName;
}

function microToSTX(micro) {
  return (Number(micro) / 1_000_000).toFixed(4);
}

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 8) + "..." + addr.slice(-6);
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return days + "d ago";
  if (hrs > 0) return hrs + "h ago";
  if (mins > 0) return mins + "m ago";
  return "just now";
}

export default function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState([]);
  const [contractStats, setContractStats] = useState({});
  const [walletStats, setWalletStats] = useState([]);
  const [totals, setTotals] = useState({ txCount: 0, totalFees: 0, uniqueWallets: 0, volume: [] });
  const [lastUpdated, setLastUpdated] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const allTxs = [];
      const stats = {};
      const walletMap = {};

      for (const name of CONTRACTS) {
        const url = `${API}/extended/v1/address/${CONTRACT_ADDRESS}.${name}/transactions?limit=50`;
        const res = await fetch(url);
        const data = await res.json();
        const results = data.results || [];

        let txCount = 0;
        let totalFees = 0;

        for (const tx of results) {
          if (tx.tx_status !== "success") continue;
          txCount++;
          totalFees += Number(tx.fee_rate || 0);

          const sender = tx.sender_address;
          if (!walletMap[sender]) walletMap[sender] = { txCount: 0, totalFees: 0, anchors: 0, attests: 0, mints: 0 };
          walletMap[sender].txCount++;
          walletMap[sender].totalFees += Number(tx.fee_rate || 0);

          const fnName = tx.contract_call?.function_name || "";
          if (fnName.includes("store")) walletMap[sender].anchors++;
          if (fnName.includes("attest")) walletMap[sender].attests++;
          if (fnName.includes("mint")) walletMap[sender].mints++;

          allTxs.push({
            txid: tx.tx_id,
            sender: tx.sender_address,
            fn: fnName,
            contract: name,
            fee: tx.fee_rate || 0,
            block: tx.block_height,
            ts: tx.burn_block_time_iso || tx.parent_burn_block_time_iso,
          });
        }

        stats[name] = { txCount, totalFees };
      }

      allTxs.sort((a, b) => (b.block || 0) - (a.block || 0));

      const walletList = Object.entries(walletMap)
        .map(([addr, s]) => ({ addr, ...s }))
        .sort((a, b) => b.txCount - a.txCount)
        .slice(0, 10);

      const totalFees = Object.values(stats).reduce((s, c) => s + c.totalFees, 0);
      const totalTxs = Object.values(stats).reduce((s, c) => s + c.txCount, 0);

      const volumeMap = {};
      for (const tx of allTxs) {
        if (!tx.ts) continue;
        const day = tx.ts.slice(0, 10);
        volumeMap[day] = (volumeMap[day] || 0) + 1;
      }
      const volume = Object.entries(volumeMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-14);

      setTxs(allTxs.slice(0, 30));
      setContractStats(stats);
      setWalletStats(walletList);
      setTotals({ txCount: totalTxs, totalFees, uniqueWallets: walletList.length, volume });
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const maxVol = Math.max(...totals.volume.map(v => v[1]), 1);

  if (!auth) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: "40px 48px", width: "100%", maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 28, letterSpacing: 3, color: "#fff", marginBottom: 8 }}>DASHBOARD</div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#444", marginBottom: 32, letterSpacing: 1 }}>RESTRICTED ACCESS</div>
            <input
              type="password"
              placeholder="Enter password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false); }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (pw === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
                    setAuth(true);
                  } else {
                    setPwError(true);
                  }
                }
              }}
              style={{ width: "100%", background: "#080808", border: `1px solid ${pwError ? "#ef4444" : "#1a1a1a"}`, borderRadius: 6, padding: "12px 14px", color: "#f0f0f0", fontFamily: "DM Mono, monospace", fontSize: 13, outline: "none", marginBottom: 12, letterSpacing: 1 }}
            />
            {pwError && <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#ef4444", marginBottom: 12 }}>Wrong password</div>}
            <button
              onClick={() => {
                if (pw === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
                  setAuth(true);
                } else {
                  setPwError(true);
                }
              }}
              style={{ width: "100%", padding: "12px", background: "#F7931A", border: "none", borderRadius: 6, color: "#000", fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}
            >
              Enter
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <div>
            <div className="title">Protocol Dashboard</div>
            <div className="subtitle">
              {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)} · Stacks Mainnet
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {lastUpdated && (
              <div className="live-label">
                <span className="live-dot" />
                Updated {timeAgo(lastUpdated)}
              </div>
            )}
            <button className="refresh-btn" onClick={fetchData}>Refresh</button>
            <a href="/" style={{ textDecoration: "none" }}>
              <button className="refresh-btn">← App</button>
            </a>
          </div>
        </div>

        {loading ? (
          <div className="loading">Fetching on-chain data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value orange">{totals.txCount}</div>
                <div className="stat-sub">across 3 contracts</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Fees Paid</div>
                <div className="stat-value green">{microToSTX(totals.totalFees)}</div>
                <div className="stat-sub">STX in fees</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Unique Wallets</div>
                <div className="stat-value purple">{totals.uniqueWallets}</div>
                <div className="stat-sub">active users</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg Fee Per Tx</div>
                <div className="stat-value" style={{ color: "#38bdf8" }}>
                  {totals.txCount > 0 ? microToSTX(totals.totalFees / totals.txCount) : "0.0000"}
                </div>
                <div className="stat-sub">STX per transaction</div>
              </div>
            </div>

            {totals.volume.length > 0 && (
              <div className="section">
                <div className="section-title">Transaction Volume (Last 14 Days)</div>
                <div className="bar-wrap">
                  {totals.volume.map(([day, count], i) => (
                    <div key={i} className="bar-col">
                      <div
                        className="bar"
                        style={{ height: Math.max((count / maxVol) * 90, 4) + "px" }}
                        title={`${day}: ${count} txs`}
                      />
                      <div className="bar-label">{day.slice(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section">
              <div className="section-title">Contract Breakdown</div>
              <div className="contract-grid">
                {CONTRACTS.map((name) => {
                  const s = contractStats[name] || { txCount: 0, totalFees: 0 };
                  return (
                    <div key={name} className="contract-card">
                      <div className="contract-name">{name}</div>
                      <div className="contract-addr">{CONTRACT_ADDRESS}.{name}</div>
                      <div className="contract-stat">
                        <div className="contract-stat-label">Transactions</div>
                        <div className="contract-stat-value">{s.txCount}</div>
                      </div>
                      <div className="contract-stat">
                        <div className="contract-stat-label">Fees Collected</div>
                        <div className="contract-stat-value">{microToSTX(s.totalFees)} STX</div>
                      </div>
                      <div className="contract-stat">
                        <div className="contract-stat-label">Avg Fee</div>
                        <div className="contract-stat-value">
                          {s.txCount > 0 ? microToSTX(s.totalFees / s.txCount) : "0.0000"} STX
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <div className="section-title">Most Active Wallets</div>
              <div className="wallets-list">
                {walletStats.length === 0 && (
                  <div style={{ color: "#444", fontFamily: "Space Mono", fontSize: 12, padding: 20 }}>No wallet data yet</div>
                )}
                {walletStats.map((w, i) => (
                  <div key={i} className="wallet-row">
                    <div>
                      <div className="wallet-addr">
                        <span style={{ color: "#F7931A", marginRight: 10 }}>#{i + 1}</span>
                        <a href={`/profile/${w.addr}`} style={{ color: "#e8e8e8", textDecoration: "none" }}>
                          {shortAddr(w.addr)}
                        </a>
                      </div>
                      <div style={{ fontSize: 10, fontFamily: "Space Mono", color: "#444", marginTop: 4 }}>
                        {w.anchors} anchors · {w.attests} attests · {w.mints} mints
                      </div>
                    </div>
                    <div className="wallet-stats">
                      <div className="wallet-stat">
                        <div className="wallet-stat-value">{w.txCount}</div>
                        <div className="wallet-stat-label">Txs</div>
                      </div>
                      <div className="wallet-stat">
                        <div className="wallet-stat-value">{microToSTX(w.totalFees)}</div>
                        <div className="wallet-stat-label">STX Fees</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-title">Recent Transactions</div>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Contract</th>
                    <th>Sender</th>
                    <th>Fee (STX)</th>
                    <th>Block</th>
                    <th>Time</th>
                    <th>TX</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ color: "#444", textAlign: "center", padding: 30 }}>No transactions yet</td>
                    </tr>
                  )}
                  {txs.map((tx, i) => (
                    <tr key={i}>
                      <td><span className={getBadgeClass(tx.fn)}>{getFnLabel(tx.fn)}</span></td>
                      <td style={{ color: "#666" }}>{tx.contract}</td>
                      <td>
                        <a href={`/profile/${tx.sender}`} style={{ color: "#e8e8e8", textDecoration: "none" }}>
                          {shortAddr(tx.sender)}
                        </a>
                      </td>
                      <td style={{ color: "#F7931A" }}>{microToSTX(tx.fee)}</td>
                      <td style={{ color: "#666" }}>{tx.block ? "#" + tx.block.toLocaleString() : "-"}</td>
                      <td style={{ color: "#444" }}>{tx.ts ? timeAgo(tx.ts) : "-"}</td>
                      <td>
                        
                          <a href={"https://explorer.hiro.so/txid/" + tx.txid + ""}
                          target="_blank"
                          className="tx-link"
                        >
                          {tx.txid.slice(0, 8)}...
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontFamily: "Space Mono", color: "#444" }}>
                ProofLedger Protocol · Stacks Mainnet · Auto-refreshes every 60s
              </div>
              <div style={{ fontSize: 11, fontFamily: "Space Mono", color: "#444" }}>
                {lastUpdated ? lastUpdated.toLocaleTimeString() : ""}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
