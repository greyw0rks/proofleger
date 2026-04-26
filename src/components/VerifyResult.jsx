"use client";
import HashDisplay from "./HashDisplay";
import DocTypeTag from "./DocTypeTag";
import BlockBadge from "./BlockBadge";
import { formatTimestamp } from "@/utils/format";

const CHAIN_LABEL = { stacks: "STACKS", celo: "CELO" };

export default function VerifyResult({ result }) {
  if (!result) return null;

  const { found, chain, data, error } = result;

  if (error) return (
    <div style={{ border: "2px solid #ff3333", padding: 16, fontFamily: "Space Mono, monospace",
      fontSize: 11, color: "#ff3333" }}>
      ERROR: {error}
    </div>
  );

  if (!found) return (
    <div style={{ border: "2px solid #333", padding: 20, textAlign: "center" }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 13, color: "#555", letterSpacing: 2, marginBottom: 6 }}>
        NOT FOUND
      </div>
      <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "#333" }}>
        Hash not anchored on {CHAIN_LABEL[chain] || "any chain"}
      </div>
    </div>
  );

  return (
    <div style={{ border: "2px solid #00ff88", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 13, color: "#00ff88", letterSpacing: 2 }}>
          ✓ VERIFIED
        </div>
        <span style={{ fontFamily: "Space Mono, monospace",
          fontSize: 9, color: "#00ff8866",
          border: "1px solid #00ff8833", padding: "3px 8px" }}>
          {CHAIN_LABEL[chain]}
        </span>
      </div>
      {data?.title && (
        <div style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 15, color: "#f5f0e8", marginBottom: 12 }}>
          {data.title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data?.hash && <HashDisplay hash={data.hash} label="HASH" />}
        {data?.issuer && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 9, color: "#555", letterSpacing: 1 }}>ISSUER</span>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#888" }}>
              {data.issuer}
            </span>
          </div>
        )}
        {data?.docType && <DocTypeTag type={data.docType} />}
        {data?.blockHeight && <BlockBadge blockHeight={data.blockHeight} />}
        {data?.timestamp && (
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#555" }}>
            {formatTimestamp(data.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}