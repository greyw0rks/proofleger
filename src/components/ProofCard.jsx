"use client";
import HashDisplay      from "./HashDisplay";
import DocTypeTag       from "./DocTypeTag";
import BlockBadge       from "./BlockBadge";
import TxLink           from "./TxLink";
import CrossChainStatus from "./CrossChainStatus";
import ShareProofButton from "./ShareProofButton";
import { formatTimestamp } from "@/utils/format";

export default function ProofCard({ proof, chain = "stacks" }) {
  if (!proof) return null;

  const isStacks = chain === "stacks";
  const title    = proof.title    || "Untitled document";
  const docType  = proof.doc_type || proof.category;
  const hash     = proof.hash;
  const blockH   = isStacks ? proof.block_height  : null;
  const txId     = proof.tx_id    || proof.txid;
  const sender   = isStacks ? proof.sender : proof.from_address;
  const ts       = proof.created_at || proof.indexed_at;

  return (
    <div style={{ border: "2px solid #1a1a1a", padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 15, color: "#f5f0e8", marginBottom: 4,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          {sender && (
            <div style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#555" }}>
              {sender.slice(0, 14)}...
            </div>
          )}
        </div>
        {docType && <DocTypeTag type={docType} />}
      </div>

      {/* Hash */}
      <div style={{ marginBottom: 12 }}>
        <HashDisplay hash={hash} label="HASH" />
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10,
        marginBottom: 16, alignItems: "center" }}>
        {blockH  && <BlockBadge blockHeight={blockH} />}
        {txId    && <TxLink txId={txId} network={chain} />}
        {ts      && (
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 8, color: "#444" }}>{formatTimestamp(ts)}</span>
        )}
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 7, color: "#00ff88", letterSpacing: 1,
          border: "1px solid #00ff8833", padding: "2px 6px" }}>
          ✓ VERIFIED
        </span>
      </div>

      {/* Cross-chain */}
      {isStacks && hash && (
        <div style={{ marginBottom: 14 }}>
          <CrossChainStatus stacksHash={hash} stacksTxId={txId} />
        </div>
      )}

      {/* Actions */}
      <ShareProofButton hash={hash} />
    </div>
  );
}