export function parseTxType(tx) {
  if (!tx) return "unknown";
  if (tx.tx_type === "contract_call") return tx.contract_call?.function_name || "contract_call";
  return tx.tx_type || "unknown";
}

export function isCoreProofTx(tx) {
  if (!tx || tx.tx_status !== "success") return false;
  const fn = tx.contract_call?.function_name || "";
  return fn.includes("store") || fn.includes("anchor");
}

export function isAttestTx(tx) {
  return tx?.tx_status === "success" && (tx.contract_call?.function_name || "").includes("attest");
}

export function isMintTx(tx) {
  return tx?.tx_status === "success" && (tx.contract_call?.function_name || "").includes("mint");
}

export function txExplorerUrl(txId) {
  return `https://explorer.hiro.so/txid/${txId}`;
}

export function addressExplorerUrl(address) {
  return `https://explorer.hiro.so/address/${address}`;
}