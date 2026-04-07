"use client";
export default function WalletAddress({ address, link = true }) {
  if (!address) return null;
  const short = `${address.slice(0,8)}...${address.slice(-6)}`;
  const href = `https://explorer.hiro.so/address/${address}`;
  if (!link) return <span style={{ fontFamily:"Space Mono, monospace", fontSize:12, color:"#888" }}>{short}</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily:"Space Mono, monospace", fontSize:12, color:"#888", textDecoration:"none" }}
      onMouseOver={e => e.target.style.color="#F7931A"} onMouseOut={e => e.target.style.color="#888"}>
      {short}
    </a>
  );
}
