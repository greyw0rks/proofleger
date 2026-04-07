export function isValidStacksAddress(address) {
  if (!address || typeof address !== "string") return false;
  return (address.startsWith("SP") || address.startsWith("ST")) && address.length >= 30 && address.length <= 50;
}
export function explorerTxUrl(txid) {
  return `https://explorer.hiro.so/txid/${txid}`;
}
export function explorerAddressUrl(address) {
  return `https://explorer.hiro.so/address/${address}`;
}
export function explorerContractUrl(address, name) {
  return `https://explorer.hiro.so/txid/${address}.${name}`;
}
export function microStxToStx(microStx) {
  return Number(microStx) / 1_000_000;
}
