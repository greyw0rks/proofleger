"use client";
import { truncateHash, truncateAddress, formatBlock, formatDocType, timeAgo } from "@/utils/formatters";

/**
 * ProofCard displays a single anchored document proof.
 *
 * Shows hash, title, doc type, block height, owner address,
 * attestation count, and optional action buttons.
 *
 * @param {object} props
 * @param {string} props.hash - SHA-256 hex hash
 * @param {string} props.title - Document title
 * @param {string} props.docType - Document type
 * @param {number} props.blockHeight - Stacks block height when anchored
 * @param {string} props.owner - Stacks wallet address of owner
 * @param {number} [props.attestations=0] - Number of attestations
 * @param {number} [props.timestamp] - Unix timestamp
 * @param {function} [props.onAttest] - Attest button callback
 * @param {function} [props.onMint] - Mint NFT button callback
 * @param {boolean} [props.isOwner=false] - Whether viewer owns this proof
 */
export default function ProofCard({
  hash, title, docType, blockHeight, owner,
  attestations = 0, timestamp, onAttest, onMint, isOwner = false,
}) {
  const s = {
    card: { border: "3px solid #f5f0e8", padding: "20px", background: "#0a0a0a", boxShadow: "6px 6px 0px #f5f0e8", marginBottom: "16px" },
    title: { fontFamily: "Archivo Black, sans-serif", fontSize: "18px", color: "#f5f0e8", marginBottom: "8px" },
    meta: { fontSize: "12px", color: "#888", fontFamily: "Space Mono, monospace", marginBottom: "4px" },
    hash: { fontSize: "11px", color: "#F7931A", fontFamily: "Space Mono, monospace", marginBottom: "12px", wordBreak: "break-all" },
    tag: { display: "inline-block", border: "2px solid #f5f0e8", padding: "2px 8px", fontSize: "11px", fontFamily: "Archivo Black, sans-serif", marginRight: "8px", marginBottom: "12px" },
    btn: { border: "3px solid #f5f0e8", padding: "8px 16px", background: "transparent", color: "#f5f0e8", fontFamily: "Archivo Black, sans-serif", fontSize: "12px", cursor: "pointer", marginRight: "8px", boxShadow: "3px 3px 0px #f5f0e8" },
    attestCount: { fontSize: "12px", color: "#00ff88", fontFamily: "Space Mono, monospace" },
  };

  return (
    <div style={s.card}>
      <div style={s.title}>{title || "Untitled Document"}</div>
      <div style={s.hash}>{truncateHash(hash, 12, 12)}</div>
      <span style={s.tag}>{formatDocType(docType)}</span>
      <div style={s.meta}>{formatBlock(blockHeight)} {timestamp ? `· ${timeAgo(timestamp)}` : ""}</div>
      <div style={s.meta}>Owner: {truncateAddress(owner)}</div>
      {attestations > 0 && (
        <div style={{ ...s.attestCount, marginTop: "8px" }}>
          ✓ {attestations} attestation{attestations !== 1 ? "s" : ""}
        </div>
      )}
      {(onAttest || onMint) && (
        <div style={{ marginTop: "16px" }}>
          {onAttest && !isOwner && (
            <button style={s.btn} onClick={() => onAttest(hash)}>ATTEST</button>
          )}
          {onMint && isOwner && (
            <button style={{ ...s.btn, borderColor: "#F7931A", color: "#F7931A", boxShadow: "3px 3px 0px #F7931A" }} onClick={() => onMint(hash, docType, title)}>
              MINT NFT
            </button>
          )}
        </div>
      )}
    </div>
  );
}
