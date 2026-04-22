"use client";
export default function TxLink({ txId, network = "stacks", shorten = true }) {
  if (!txId) return null;
  const url = network === "celo"
    ? `https://celoscan.io/tx/${txId}`
    : `https://explorer.hiro.so/txid/${txId}`;
  const display = shorten ? `${txId.slice(0,10)}...${txId.slice(-6)}` : txId;
  return (
    <a href={url} target="_blank" rel="noreferrer"
      style={{ fontFamily:"Space Mono, monospace", fontSize:10,
        color:"#F7931A", textDecoration:"none" }}
      onMouseOver={e => e.currentTarget.style.textDecoration="underline"}
      onMouseOut={e => e.currentTarget.style.textDecoration="none"}>
      {display} ↗
    </a>
  );
}