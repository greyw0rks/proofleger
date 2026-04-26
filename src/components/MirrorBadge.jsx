"use client";
import { useState, useEffect } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function MirrorBadge({ stacksHash }) {
  const [mirror, setMirror] = useState(null);

  useEffect(() => {
    if (!stacksHash || !VERIFIER_API) return;
    fetch(`${VERIFIER_API}/v2/mirror/${stacksHash}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setMirror(d))
      .catch(() => {});
  }, [stacksHash]);

  if (!mirror) return null;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
      border: `1px solid ${mirror.confirmed ? "#FCFF5244" : "#33333388"}`,
      background: mirror.confirmed ? "#FCFF5208" : "transparent",
      padding: "3px 10px" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%",
        background: mirror.confirmed ? "#FCFF52" : "#555", flexShrink: 0 }} />
      <span style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 8, color: mirror.confirmed ? "#FCFF52" : "#555",
        letterSpacing: 1 }}>
        {mirror.confirmed ? "MIRRORED ON CELO" : "MIRROR PENDING"}
      </span>
    </div>
  );
}