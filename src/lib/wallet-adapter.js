"use client";
import { getAddress, isWalletConnected, anchorDocument, verifyDocument, attestDocument } from "./wallet";
import { anchorDocumentCelo, verifyDocumentCelo, attestDocumentCelo, CELO_CONTRACT_ADDRESS } from "./wallet-celo";

export function getActiveWallet(network) {
  if (network === "celo") {
    return {
      isConnected: () => typeof window !== "undefined" && !!window.ethereum,
      getAddress: async () => {
        const accounts = await window.ethereum?.request({ method: "eth_accounts" });
        return accounts?.[0] || null;
      },
      anchor: anchorDocumentCelo,
      verify: verifyDocumentCelo,
      attest: (hash) => attestDocumentCelo(hash),
      explorer: "https://celoscan.io",
      contractAddress: CELO_CONTRACT_ADDRESS,
    };
  }
  return {
    isConnected: isWalletConnected,
    getAddress: async () => getAddress(),
    anchor: anchorDocument,
    verify: verifyDocument,
    attest: attestDocument,
    explorer: "https://explorer.hiro.so",
    contractAddress: "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK",
  };
}