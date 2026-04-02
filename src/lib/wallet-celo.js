/**
 * wallet-celo.js
 * Celo blockchain interactions for ProofLedger
 * Uses viem with Celo chain — MiniPay compatible
 *
 * Update CELO_CONTRACT_ADDRESS after deploying ProofLedger.sol to Celo mainnet
 */

// ─── Update these after deployment ──────────────────────────
export const CELO_CONTRACT_ADDRESS = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
export const CELO_CREDENTIALS_ADDRESS = "0xe27c611327f788F4fee1bE5A32fD4650F04E09Ee";
export const CELO_CHAIN_ID = 42220;
export const CELO_RPC = "https://feth.celo.org";
export const CELO_EXPLORER = "https://celoscan.io";

export const PROOF_LEDGER_ABI = [
  { name: "anchorDocument", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "hash", type: "bytes32" }, { name: "title", type: "string" }, { name: "docType", type: "string" }],
    outputs: [] },
  { name: "attestDocument", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "hash", type: "bytes32" }, { name: "credentialType", type: "string" }],
    outputs: [] },
  { name: "verifyDocument", type: "function", stateMutability: "view",
    inputs: [{ name: "hash", type: "bytes32" }],
    outputs: [{ type: "tuple", components: [
      { name: "owner", type: "address" }, { name: "blockNumber", type: "uint256" },
      { name: "timestamp", type: "uint256" }, { name: "title", type: "string" },
      { name: "docType", type: "string" }, { name: "attestationCount", type: "uint256" },
      { name: "exists", type: "bool" }
    ]}] },
  { name: "documentCount", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "totalDocuments", type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }] },
];

function hexToBytes32(hexHash) {
  const clean = hexHash.startsWith("0x") ? hexHash : `0x${hexHash}`;
  return clean;
}

async function getViemClients() {
  const { createWalletClient, createPublicClient, custom, http } = await import("viem");
  const { celo } = await import("viem/chains");
  const publicClient = createPublicClient({ chain: celo, transport: http(CELO_RPC) });
  const walletClient = typeof window !== "undefined" && window.ethereum
    ? createWalletClient({ chain: celo, transport: custom(window.ethereum) })
    : null;
  return { publicClient, walletClient };
}

export async function anchorDocumentCelo(hashHex, title, docType) {
  const { walletClient } = await getViemClients();
  if (!walletClient) throw new Error("No wallet connected");
  const [address] = await walletClient.getAddresses();
  return walletClient.writeContract({
    address: CELO_CONTRACT_ADDRESS, abi: PROOF_LEDGER_ABI,
    functionName: "anchorDocument",
    args: [hexToBytes32(hashHex), title, docType],
    account: address,
  });
}

export async function verifyDocumentCelo(hashHex) {
  const { publicClient } = await getViemClients();
  const result = await publicClient.readContract({
    address: CELO_CONTRACT_ADDRESS, abi: PROOF_LEDGER_ABI,
    functionName: "verifyDocument", args: [hexToBytes32(hashHex)],
  });
  return result.exists ? result : null;
}

export async function attestDocumentCelo(hashHex) {
  const { walletClient } = await getViemClients();
  if (!walletClient) throw new Error("No wallet connected");
  const [address] = await walletClient.getAddresses();
  return walletClient.writeContract({
    address: CELO_CONTRACT_ADDRESS, abi: PROOF_LEDGER_ABI,
    functionName: "attestDocument",
    args: [hexToBytes32(hashHex), "attestation"],
    account: address,
  });
}

export async function getDocumentCountCelo(ownerAddress) {
  const { publicClient } = await getViemClients();
  return publicClient.readContract({
    address: CELO_CONTRACT_ADDRESS, abi: PROOF_LEDGER_ABI,
    functionName: "documentCount", args: [ownerAddress],
  });
}
