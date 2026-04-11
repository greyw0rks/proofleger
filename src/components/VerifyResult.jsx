"use client";
import BlockBadge from "./BlockBadge";
import DocTypeTag from "./DocTypeTag";
import WalletAddress from "./WalletAddress";
export default function VerifyResult({ result, hash, network = "stacks" }) {
  if (!result) return (
    <div style={{ border:"3px solid #ff3333", padding:20, color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:13 }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20, marginBottom:8 }}>✗ NOT FOUND</div>
      <div style={{ fontSize:11, color:"#666" }}>This hash has not been anchored on {network === "celo" ? "Celo" : "Bitcoin/Stacks"}</div>
    </div>
  );
  const blockHeight = result["block-height"] || result.blockHeight || result.blockNumber;
  const owner = result.owner;
  const title = result.title;
  const docType = result["doc-type"] || result.docType;
  return (
    <div style={{ border:"3px solid #00ff88", padding:20, boxShadow:"6px 6px 0 #00ff88" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22, color:"#00ff88", marginBottom:16 }}>✓ VERIFIED</div>
      {title && <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18, color:"#f5f0e8", marginBottom:12 }}>{title}</div>}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        {docType && <DocTypeTag type={docType} />}
        {blockHeight && <BlockBadge blockHeight={blockHeight} />}
      </div>
      {owner && <div style={{ marginBottom:8 }}><WalletAddress address={owner} /></div>}
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#444", wordBreak:"break-all", marginTop:12 }}>{hash}</div>
    </div>
  );
}