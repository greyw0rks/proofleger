var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CACHE_KEYS: () => CACHE_KEYS,
  CELO_BLOCK_TIME_SECS: () => CELO_BLOCK_TIME_SECS,
  CELO_CHAIN_ID: () => CELO_CHAIN_ID,
  CELO_EXPLORER: () => CELO_EXPLORER,
  CELO_RPC: () => CELO_RPC,
  CLIPBOARD_RESET_MS: () => CLIPBOARD_RESET_MS,
  HASH_CHUNK_SIZE: () => HASH_CHUNK_SIZE,
  KEYS: () => KEYS,
  LARGE_FILE_MB: () => LARGE_FILE_MB,
  MAX_TITLE_LENGTH: () => MAX_TITLE_LENGTH,
  ProofLedgerClient: () => ProofLedgerClient,
  STACKS_API: () => STACKS_API,
  STACKS_BLOCK_TIME_SECS: () => STACKS_BLOCK_TIME_SECS,
  STACKS_CONTRACT_ADDRESS: () => STACKS_CONTRACT_ADDRESS,
  STACKS_CONTRACT_NAME: () => STACKS_CONTRACT_NAME,
  STACKS_EXPLORER: () => STACKS_EXPLORER,
  anchorDocument: () => anchorDocument,
  attestDocument: () => attestDocument,
  buildProofUrl: () => buildProofUrl,
  buildShareText: () => buildShareText,
  computeReputation: () => computeReputation,
  connectWallet: () => connectWallet,
  disconnectWallet: () => disconnectWallet,
  fetchAchievementNFTs: () => fetchAchievementNFTs,
  fetchAddressTransactions: () => fetchAddressTransactions,
  fetchBalance: () => fetchBalance,
  fetchBlockHeight: () => fetchBlockHeight,
  fetchContractTxs: () => fetchContractTxs,
  formatBlock: () => formatBlock,
  formatDate: () => formatDate,
  formatDocType: () => formatDocType,
  formatFileSize: () => formatFileSize,
  formatStx: () => formatStx,
  getAccountInfo: () => getAccountInfo,
  getAchievementMeta: () => getAchievementMeta,
  getAddress: () => getAddress,
  getAddressType: () => getAddressType,
  getContractTxs: () => getContractTxs,
  getDocumentAttestations: () => getDocumentAttestations,
  getNetworkInfo: () => getNetworkInfo,
  getTier: () => getTier,
  getTokenByHash: () => getTokenByHash,
  getWalletAchievements: () => getWalletAchievements,
  getWalletCount: () => getWalletCount,
  getWalletDocAt: () => getWalletDocAt,
  getWalletProfile: () => getWalletProfile,
  hashFile: () => hashFile,
  hashText: () => hashText,
  isCeloAddress: () => isCeloAddress,
  isHexHash: () => isHexHash,
  isStacksAddress: () => isStacksAddress,
  isValidDocType: () => isValidDocType,
  isValidEvmAddress: () => isValidEvmAddress,
  isValidHash: () => isValidHash,
  isValidStacksAddress: () => isValidStacksAddress,
  isValidTitle: () => isValidTitle,
  isWalletConnected: () => isWalletConnected,
  mintAchievement: () => mintAchievement,
  prepareProof: () => prepareProof,
  sanitizeTitle: () => sanitizeTitle,
  shortenAddress: () => shortenAddress,
  shortenCeloAddress: () => shortenCeloAddress,
  shortenStacksAddress: () => shortenStacksAddress,
  storageGet: () => storageGet,
  storageRemove: () => storageRemove,
  storageSet: () => storageSet,
  timeAgo: () => timeAgo,
  truncateAddress: () => truncateAddress,
  truncateHash: () => truncateHash,
  validateProofInput: () => validateProofInput,
  verifyDocument: () => verifyDocument
});
module.exports = __toCommonJS(index_exports);

// src/lib/api.js
var HIRO_API = "https://api.hiro.so";
var CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
async function fetchAddressTransactions(address, limit = 20) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/transactions?limit=${limit}`
  );
  if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}
async function fetchBalance(address) {
  var _a;
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/balances`
  );
  if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
  const data = await res.json();
  const microStx = ((_a = data.stx) == null ? void 0 : _a.balance) || "0";
  const stx = (parseInt(microStx) / 1e6).toFixed(6);
  return { stx, microStx };
}
async function fetchAchievementNFTs(address) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${CONTRACT_ADDRESS}.achievements::achievement-nft`
  );
  if (!res.ok) throw new Error(`Failed to fetch NFTs: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}
async function fetchContractTxs(contractName, limit = 50, offset = 0) {
  const contractId = `${CONTRACT_ADDRESS}.${contractName}`;
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Failed to fetch contract txs: ${res.status}`);
  return res.json();
}
async function fetchBlockHeight() {
  var _a;
  const res = await fetch(`${HIRO_API}/extended/v1/info/network_block_times`);
  if (!res.ok) throw new Error(`Failed to fetch block height: ${res.status}`);
  const data = await res.json();
  return ((_a = data.mainnet) == null ? void 0 : _a.target_block_time) || 0;
}

// src/lib/wallet.js
var USE_TESTNET = false;
var CONTRACT_ADDRESS2 = USE_TESTNET ? "ST1SY1E599GN04XRD2DQBKV7E62HYBJR2CSC3MXNA" : "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
var CONTRACT_NAME = "proofleger3";
var NETWORK = USE_TESTNET ? "testnet" : "mainnet";
var CRED_CONTRACT = "credentials";
var NFT_CONTRACT = "achievements";
async function connectWallet({ onSuccess, onCancel }) {
  try {
    const { connect } = await import("@stacks/connect");
    const response = await connect();
    if (response && response.addresses && response.addresses.length > 0) {
      const stxAddr = response.addresses.find(
        (a) => USE_TESTNET ? a.address.startsWith("ST") : a.address.startsWith("SP")
      );
      const addr = stxAddr ? stxAddr.address : response.addresses[0].address;
      localStorage.setItem("proofleger_address", addr);
      onSuccess({ address: addr });
    } else {
      if (onCancel) onCancel();
    }
  } catch (e) {
    console.error("Wallet connect error:", e);
    if (onCancel) onCancel();
  }
}
function disconnectWallet() {
  localStorage.removeItem("proofleger_address");
}
function isWalletConnected() {
  try {
    return !!localStorage.getItem("proofleger_address");
  } catch {
    return false;
  }
}
function getAddress() {
  try {
    return localStorage.getItem("proofleger_address");
  } catch {
    return null;
  }
}
async function anchorDocument(hexHash, title, docType, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { stringAsciiCV, bufferCV } = await import("@stacks/transactions");
    const safeTitle = (title || "Untitled").replace(/[^\x00-\x7F]/g, "").slice(0, 100);
    const safeType = (docType || "other").replace(/[^\x00-\x7F]/g, "").slice(0, 50);
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CONTRACT_NAME,
      functionName: "store",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV(safeTitle),
        stringAsciiCV(safeType)
      ],
      network: NETWORK,
      onFinish: (data) => {
        onSuccess(data.txId);
      },
      onCancel: () => {
        if (onError) onError("Transaction cancelled");
      }
    });
  } catch (e) {
    console.error("Anchor error:", e);
    if (onError) onError(e.message);
  }
}
async function verifyDocument(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import("@stacks/transactions");
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CONTRACT_NAME,
      functionName: "get-doc",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const json = cvToJSON(result);
    if (!json.value || !json.value.value) return null;
    const data = json.value.value;
    return {
      owner: data.owner.value,
      block: data["block-height"].value,
      title: data.title.value,
      docType: data["doc-type"].value
    };
  } catch (e) {
    console.error("Verify error:", e);
    return null;
  }
}
async function getWalletCount(owner) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV } = await import("@stacks/transactions");
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CONTRACT_NAME,
      functionName: "get-wallet-count",
      functionArgs: [standardPrincipalCV(owner)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const json = cvToJSON(result);
    return parseInt(json.value) || 0;
  } catch (e) {
    console.error("Count error:", e);
    return 0;
  }
}
async function getWalletDocAt(owner, index) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import("@stacks/transactions");
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CONTRACT_NAME,
      functionName: "get-wallet-doc-at",
      functionArgs: [standardPrincipalCV(owner), uintCV(index)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const json = cvToJSON(result);
    if (!json.value || !json.value.value) return null;
    const data = json.value.value;
    const hashBytes = data.hash.value;
    const hashHex = hashBytes.slice(2);
    return {
      hash: hashHex,
      owner: data.owner.value,
      block: data["block-height"].value,
      title: data.title.value,
      docType: data["doc-type"].value
    };
  } catch (e) {
    console.error("Doc fetch error:", e);
    return null;
  }
}
async function getWalletProfile(owner) {
  const count = await getWalletCount(owner);
  if (count === 0) return [];
  const promises = Array.from({ length: count }, (_, i) => getWalletDocAt(owner, i));
  const docs = await Promise.all(promises);
  return docs.filter(Boolean);
}
async function attestDocument(hexHash, credentialType, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { bufferCV, stringAsciiCV } = await import("@stacks/transactions");
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CRED_CONTRACT,
      functionName: "attest",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV((credentialType || "verified").slice(0, 50))
      ],
      network: NETWORK,
      onFinish: (data) => onSuccess(data.txId),
      onCancel: () => {
        if (onError) onError("Cancelled");
      }
    });
  } catch (e) {
    console.error("Attest error:", e);
    if (onError) onError(e.message);
  }
}
async function getDocumentAttestations(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON, uintCV, standardPrincipalCV } = await import("@stacks/transactions");
    const countResult = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: CRED_CONTRACT,
      functionName: "get-attestation-count",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const count = parseInt(cvToJSON(countResult).value) || 0;
    if (count === 0) return [];
    const attestations = [];
    for (let i = 0; i < count; i++) {
      const issuerResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS2,
        contractName: CRED_CONTRACT,
        functionName: "get-issuer-at",
        functionArgs: [bufferCV(Buffer.from(hexHash, "hex")), uintCV(i)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS2
      });
      const issuerJson = cvToJSON(issuerResult);
      if (!issuerJson.value || !issuerJson.value.value) continue;
      const issuer = issuerJson.value.value;
      const attResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS2,
        contractName: CRED_CONTRACT,
        functionName: "get-attestation",
        functionArgs: [
          bufferCV(Buffer.from(hexHash, "hex")),
          standardPrincipalCV(issuer)
        ],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS2
      });
      const attJson = cvToJSON(attResult);
      if (!attJson.value || !attJson.value.value) continue;
      const att = attJson.value.value;
      if (att.active.value) {
        attestations.push({
          issuer,
          credentialType: att["credential-type"].value,
          issuedAt: att["issued-at"].value
        });
      }
    }
    return attestations;
  } catch (e) {
    console.error("Get attestations error:", e);
    return [];
  }
}
var ACHIEVEMENT_TYPES = {
  diploma: { label: "Certified Graduate", icon: "\u{1F393}" },
  research: { label: "Verified Researcher", icon: "\u{1F52C}" },
  art: { label: "Certified Creator", icon: "\u{1F3A8}" },
  certificate: { label: "Certified Professional", icon: "\u{1F4DC}" },
  contribution: { label: "Open Source Contributor", icon: "\u{1F4BB}" },
  award: { label: "Achievement Unlocked", icon: "\u{1F3C6}" },
  other: { label: "Verified Achievement", icon: "\u2B50" }
};
function getAchievementMeta(docType) {
  return ACHIEVEMENT_TYPES[docType] || ACHIEVEMENT_TYPES.other;
}
async function mintAchievement(hexHash, docType, title, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { bufferCV, stringAsciiCV } = await import("@stacks/transactions");
    const meta = getAchievementMeta(docType);
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: NFT_CONTRACT,
      functionName: "mint",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV(meta.label.slice(0, 50)),
        stringAsciiCV((title || "Untitled").replace(/[^\x00-\x7F]/g, "").slice(0, 100))
      ],
      network: NETWORK,
      onFinish: (data) => onSuccess(data.txId),
      onCancel: () => {
        if (onError) onError("Cancelled");
      }
    });
  } catch (e) {
    console.error("Mint error:", e);
    if (onError) onError(e.message);
  }
}
async function getTokenByHash(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import("@stacks/transactions");
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: NFT_CONTRACT,
      functionName: "get-token-by-hash",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const json = cvToJSON(result);
    if (!json.value || !json.value.value) return null;
    return parseInt(json.value.value["token-id"].value);
  } catch (e) {
    return null;
  }
}
async function getWalletAchievements(owner) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import("@stacks/transactions");
    const countResult = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS2,
      contractName: NFT_CONTRACT,
      functionName: "get-wallet-achievement-count",
      functionArgs: [standardPrincipalCV(owner)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS2
    });
    const count = parseInt(cvToJSON(countResult).value) || 0;
    if (count === 0) return [];
    const achievements = [];
    for (let i = 0; i < count; i++) {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS2,
        contractName: NFT_CONTRACT,
        functionName: "get-wallet-achievement-at",
        functionArgs: [standardPrincipalCV(owner), uintCV(i)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS2
      });
      const json = cvToJSON(result);
      if (!json.value || !json.value.value) continue;
      const data = json.value.value;
      achievements.push({
        achievementType: data["achievement-type"].value,
        title: data.title.value,
        mintedAt: data["minted-at"].value,
        owner: data.owner.value
      });
    }
    return achievements;
  } catch (e) {
    console.error("Achievements error:", e);
    return [];
  }
}
var REPUTATION_SCORES = {
  diploma: 50,
  research: 40,
  certificate: 30,
  art: 20,
  contribution: 20,
  award: 10,
  other: 10
};
var REPUTATION_TIERS = [
  { min: 1e3, label: "Legend", color: "#F7931A" },
  { min: 500, label: "Authority", color: "#a78bfa" },
  { min: 250, label: "Expert", color: "#22c55e" },
  { min: 100, label: "Contributor", color: "#38bdf8" },
  { min: 0, label: "Builder", color: "#666" }
];
function getTier(score) {
  return REPUTATION_TIERS.find((t) => score >= t.min) || REPUTATION_TIERS[4];
}
async function computeReputation(owner) {
  try {
    const [docs, achievements] = await Promise.all([
      getWalletProfile(owner),
      getWalletAchievements(owner)
    ]);
    let score = 0;
    const breakdown = [];
    for (const doc of docs) {
      const docType = doc.docType.toLowerCase();
      const base = REPUTATION_SCORES[docType] || 10;
      score += base;
      breakdown.push({
        label: doc.title,
        type: docType,
        points: base,
        reason: "Anchored document"
      });
      const attestations = doc.hash ? await getDocumentAttestations(doc.hash) : [];
      if (attestations.length > 0) {
        const attPoints = attestations.length * 10;
        score += attPoints;
        breakdown.push({
          label: doc.title,
          type: "attestation",
          points: attPoints,
          reason: `${attestations.length} attestation${attestations.length > 1 ? "s" : ""}`
        });
      }
    }
    const nftPoints = achievements.length * 25;
    if (achievements.length > 0) {
      score += nftPoints;
      breakdown.push({
        label: "Soulbound NFTs",
        type: "nft",
        points: nftPoints,
        reason: `${achievements.length} achievement NFT${achievements.length > 1 ? "s" : ""}`
      });
    }
    return {
      score,
      breakdown,
      tier: getTier(score),
      docCount: docs.length,
      attCount: docs.reduce(async (acc, doc) => acc, 0),
      nftCount: achievements.length
    };
  } catch (e) {
    console.error("Reputation error:", e);
    return { score: 0, breakdown: [], tier: getTier(0), docCount: 0, nftCount: 0 };
  }
}

// src/lib/rpc.js
var API = "https://api.hiro.so";
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2e3 * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1e3 * (i + 1)));
    }
  }
}
async function getAccountInfo(address) {
  const res = await fetchWithRetry(`${API}/v2/accounts/${address}?proof=0`);
  return res.json();
}
async function getContractTxs(contractId, limit = 50, offset = 0) {
  const res = await fetchWithRetry(`${API}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`);
  return res.json();
}
async function getNetworkInfo() {
  const res = await fetchWithRetry(`${API}/v2/info`);
  return res.json();
}

// src/utils/crypto.js
async function sha256Hex(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  return sha256Hex(buffer);
}
async function sha256Text(text) {
  const enc = new TextEncoder();
  return sha256Hex(enc.encode(text));
}
function isValidSha256(hash) {
  const clean = (hash == null ? void 0 : hash.replace(/^0x/i, "")) || "";
  return clean.length === 64 && /^[0-9a-fA-F]+$/.test(clean);
}

// src/lib/proof-service.js
async function prepareProof(input, title, docType) {
  if (!(title == null ? void 0 : title.trim())) throw new Error("Title is required");
  if (!docType) throw new Error("Document type is required");
  let hash;
  if (input instanceof File) {
    hash = await sha256File(input);
  } else if (typeof input === "string") {
    if (isValidSha256(input)) hash = input.replace("0x", "");
    else hash = await sha256Text(input);
  } else {
    throw new Error("Input must be a File or string");
  }
  return { hash, title: title.trim(), docType };
}
function buildProofUrl(hash) {
  return `https://proofleger.vercel.app/verify?hash=${hash}`;
}
function buildShareText(title, hash) {
  return `I just anchored "${title}" to Bitcoin via ProofLedger.

Verify: ${buildProofUrl(hash)}

#Bitcoin #Stacks #ProofOfExistence`;
}

// src/lib/proof-validator.js
var DOC_TYPES = ["diploma", "certificate", "research", "art", "contribution", "award", "other"];
function validateProofInput({ hash, title, docType }) {
  const errors = {};
  if (!hash) {
    errors.hash = "Hash is required";
  } else if (!isValidSha256(hash)) {
    errors.hash = "Must be a valid SHA-256 hash (64 hex chars)";
  }
  if (!(title == null ? void 0 : title.trim())) {
    errors.title = "Title is required";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be 100 characters or less";
  } else if (!/^[\x00-\x7F]*$/.test(title)) {
    errors.title = "Title must be ASCII characters only";
  }
  if (!docType) {
    errors.docType = "Document type is required";
  } else if (!DOC_TYPES.includes(docType)) {
    errors.docType = `Must be one of: ${DOC_TYPES.join(", ")}`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
function sanitizeTitle(title) {
  return (title == null ? void 0 : title.trim().replace(/[^\x00-\x7F]/g, "").slice(0, 100)) || "";
}

// src/lib/cache.js
var store = /* @__PURE__ */ new Map();
async function cacheWrap(key, fn, ttlMs = 6e4) {
  const existing = store.get(key);
  if (existing && Date.now() < existing.expires) return existing.value;
  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

// src/lib/sdk-client.js
var API2 = "https://api.hiro.so";
var CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
async function callReadOnly(contractName, fnName, args) {
  const res = await fetch(`${API2}/v2/contracts/call-read/${CONTRACT}/${contractName}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: CONTRACT, arguments: args })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}
var ProofLedgerClient = {
  verify: (hash) => cacheWrap(
    `verify:${hash}`,
    () => callReadOnly("proofleger3", "get-doc", ["0x0200000020" + hash]),
    3e5
  ),
  getProfile: (address) => cacheWrap(
    `profile:${address}`,
    () => fetch(`${API2}/v2/accounts/${address}?proof=0`).then((r) => r.json()),
    6e4
  ),
  getTxCount: (address) => fetch(`${API2}/extended/v1/address/${address}/transactions?limit=1`).then((r) => r.json()).then((d) => d.total || 0),
  getNetworkInfo: () => cacheWrap(
    "network:info",
    () => fetch(`${API2}/v2/info`).then((r) => r.json()),
    3e4
  )
};

// src/lib/storage.js
var PREFIX = "proofleger:";
function storageGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
function storageRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}
var KEYS = {
  WALLET_ADDRESS: "wallet_address",
  PREFERRED_NETWORK: "preferred_network",
  RECENT_HASHES: "recent_hashes",
  DRAFT_TITLE: "draft_title",
  DRAFT_TYPE: "draft_type"
};

// src/lib/constants.js
var STACKS_CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
var STACKS_CONTRACT_NAME = "proofleger3";
var STACKS_API = "https://api.hiro.so";
var STACKS_EXPLORER = "https://explorer.hiro.so";
var CELO_CHAIN_ID = 42220;
var CELO_RPC = "https://feth.celo.org";
var CELO_EXPLORER = "https://celoscan.io";
var MAX_TITLE_LENGTH = 100;
var LARGE_FILE_MB = 5;
var HASH_CHUNK_SIZE = 2 * 1024 * 1024;
var CACHE_KEYS = {
  proofHistory: "pl:proof-history",
  networkPref: "pl:network",
  walletAddress: "pl:wallet-address",
  recentHashes: "pl:recent-hashes"
};
var STACKS_BLOCK_TIME_SECS = 600;
var CELO_BLOCK_TIME_SECS = 5;
var CLIPBOARD_RESET_MS = 1800;

// src/utils/formatters.js
function truncateHash(hash, leading = 8, trailing = 8) {
  if (!hash || typeof hash !== "string") return "";
  if (hash.length <= leading + trailing + 3) return hash;
  return `${hash.slice(0, leading)}...${hash.slice(-trailing)}`;
}
function truncateAddress(address, leading = 6, trailing = 4) {
  if (!address || typeof address !== "string") return "";
  if (address.length <= leading + trailing + 3) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}
function formatStx(microStx, decimals = 6) {
  if (microStx === null || microStx === void 0) return "0 STX";
  const stx = Number(microStx) / 1e6;
  return `${stx.toFixed(decimals)} STX`;
}
function formatDate(timestamp, options = {}) {
  if (!timestamp) return "Unknown date";
  const defaults = { year: "numeric", month: "short", day: "numeric" };
  return new Date(timestamp * 1e3).toLocaleDateString("en-US", { ...defaults, ...options });
}
function formatBlock(blockHeight) {
  if (!blockHeight && blockHeight !== 0) return "Unknown block";
  return `Block #${Number(blockHeight).toLocaleString()}`;
}
function formatDocType(docType) {
  if (!docType) return "Document";
  return docType.charAt(0).toUpperCase() + docType.slice(1).toLowerCase();
}
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
function timeAgo(timestamp) {
  if (!timestamp) return "some time ago";
  const now = Math.floor(Date.now() / 1e3);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592e3) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(timestamp);
}

// src/utils/hash.js
var CHUNK_SIZE = 2 * 1024 * 1024;
async function hashFile(file, onProgress) {
  var _a;
  if (!((_a = window.crypto) == null ? void 0 : _a.subtle)) throw new Error("SubtleCrypto not available");
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  const buffers = [];
  for (let i = 0; i < chunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const slice = file.slice(start, end);
    const buf = await slice.arrayBuffer();
    buffers.push(buf);
    onProgress == null ? void 0 : onProgress(Math.round((i + 1) / chunks * 100));
  }
  const total = buffers.reduce((s, b) => s + b.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const buf of buffers) {
    merged.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  const hashBuf = await window.crypto.subtle.digest("SHA-256", merged);
  return bufToHex(hashBuf);
}
async function hashText(text) {
  var _a;
  if (!((_a = window.crypto) == null ? void 0 : _a.subtle)) throw new Error("SubtleCrypto not available");
  const encoded = new TextEncoder().encode(text);
  const hashBuf = await window.crypto.subtle.digest("SHA-256", encoded);
  return bufToHex(hashBuf);
}
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function isHexHash(str) {
  return /^[0-9a-f]{64}$/i.test(str == null ? void 0 : str.replace(/^0x/i, ""));
}

// src/utils/address.js
function isStacksAddress(addr) {
  return typeof addr === "string" && (addr.startsWith("SP") || addr.startsWith("ST")) && addr.length >= 30 && addr.length <= 52;
}
function isCeloAddress(addr) {
  return typeof addr === "string" && /^0x[0-9a-fA-F]{40}$/.test(addr);
}
function shortenStacksAddress(addr, chars = 6) {
  if (!isStacksAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}
function shortenCeloAddress(addr, chars = 6) {
  if (!isCeloAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}
function shortenAddress(addr, chars = 6) {
  if (isStacksAddress(addr)) return shortenStacksAddress(addr, chars);
  if (isCeloAddress(addr)) return shortenCeloAddress(addr, chars);
  return (addr == null ? void 0 : addr.slice(0, chars)) + "..." || "";
}
function getAddressType(addr) {
  if (isStacksAddress(addr)) return "stacks";
  if (isCeloAddress(addr)) return "celo";
  return "unknown";
}

// src/utils/validation.js
function isValidHash(hash) {
  if (!hash || typeof hash !== "string") return false;
  const clean = hash.replace(/^0x/i, "");
  return /^[0-9a-f]{64}$/i.test(clean);
}
function isValidStacksAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^SP[A-Z0-9]{33,41}/.test(address);
}
function isValidEvmAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
function isValidTitle(title) {
  if (!title || typeof title !== "string") return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 100 && /^[\x00-\x7F]*$/.test(trimmed);
}
var DOC_TYPES2 = ["diploma", "certificate", "research", "contribution", "award", "art", "other"];
function isValidDocType(type) {
  return DOC_TYPES2.includes(type);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CACHE_KEYS,
  CELO_BLOCK_TIME_SECS,
  CELO_CHAIN_ID,
  CELO_EXPLORER,
  CELO_RPC,
  CLIPBOARD_RESET_MS,
  HASH_CHUNK_SIZE,
  KEYS,
  LARGE_FILE_MB,
  MAX_TITLE_LENGTH,
  ProofLedgerClient,
  STACKS_API,
  STACKS_BLOCK_TIME_SECS,
  STACKS_CONTRACT_ADDRESS,
  STACKS_CONTRACT_NAME,
  STACKS_EXPLORER,
  anchorDocument,
  attestDocument,
  buildProofUrl,
  buildShareText,
  computeReputation,
  connectWallet,
  disconnectWallet,
  fetchAchievementNFTs,
  fetchAddressTransactions,
  fetchBalance,
  fetchBlockHeight,
  fetchContractTxs,
  formatBlock,
  formatDate,
  formatDocType,
  formatFileSize,
  formatStx,
  getAccountInfo,
  getAchievementMeta,
  getAddress,
  getAddressType,
  getContractTxs,
  getDocumentAttestations,
  getNetworkInfo,
  getTier,
  getTokenByHash,
  getWalletAchievements,
  getWalletCount,
  getWalletDocAt,
  getWalletProfile,
  hashFile,
  hashText,
  isCeloAddress,
  isHexHash,
  isStacksAddress,
  isValidDocType,
  isValidEvmAddress,
  isValidHash,
  isValidStacksAddress,
  isValidTitle,
  isWalletConnected,
  mintAchievement,
  prepareProof,
  sanitizeTitle,
  shortenAddress,
  shortenCeloAddress,
  shortenStacksAddress,
  storageGet,
  storageRemove,
  storageSet,
  timeAgo,
  truncateAddress,
  truncateHash,
  validateProofInput,
  verifyDocument
});
