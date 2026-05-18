import { sha256File, isValidSha256, sha256Text } from '@/utils/crypto';

/**
 * @fileoverview Stacks API helper functions for ProofLedger
 * Wraps Hiro API calls for transactions, balances, and contract reads
 */

const HIRO_API = "https://api.hiro.so";
const CONTRACT_ADDRESS$1 = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

/**
 * Fetches recent transactions for a given Stacks address
 * @param {string} address - Stacks principal address
 * @param {number} [limit=20] - Number of transactions to fetch
 * @returns {Promise<Array>} Array of transaction objects
 */
async function fetchAddressTransactions(address, limit = 20) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/transactions?limit=${limit}`
  );
  if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetches STX balance for a given address
 * @param {string} address - Stacks principal address
 * @returns {Promise<{ stx: string, microStx: string }>}
 */
async function fetchBalance(address) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/balances`
  );
  if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
  const data = await res.json();
  const microStx = data.stx?.balance || "0";
  const stx = (parseInt(microStx) / 1_000_000).toFixed(6);
  return { stx, microStx };
}

/**
 * Fetches NFTs owned by an address from the achievements contract
 * @param {string} address - Stacks principal address
 * @returns {Promise<Array>} Array of NFT asset identifiers
 */
async function fetchAchievementNFTs(address) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${CONTRACT_ADDRESS$1}.achievements::achievement-nft`
  );
  if (!res.ok) throw new Error(`Failed to fetch NFTs: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetches contract call transactions for a specific contract
 * @param {string} contractName - Contract name (e.g. "proofleger3")
 * @param {number} [limit=50] - Number of transactions to fetch
 * @param {number} [offset=0] - Pagination offset
 * @returns {Promise<{ results: Array, total: number }>}
 */
async function fetchContractTxs(contractName, limit = 50, offset = 0) {
  const contractId = `${CONTRACT_ADDRESS$1}.${contractName}`;
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Failed to fetch contract txs: ${res.status}`);
  return res.json();
}

/**
 * Fetches the current Stacks block height
 * @returns {Promise<number>} Current block height
 */
async function fetchBlockHeight() {
  const res = await fetch(`${HIRO_API}/extended/v1/info/network_block_times`);
  if (!res.ok) throw new Error(`Failed to fetch block height: ${res.status}`);
  const data = await res.json();
  return data.mainnet?.target_block_time || 0;
}

const USE_TESTNET = false;
const CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACT_NAME = "proofleger3";
const NETWORK = "mainnet";
const CRED_CONTRACT = "credentials";
const NFT_CONTRACT = "achievements";

async function connectWallet({ onSuccess, onCancel }) {
  try {
    const { connect } = await import('@stacks/connect');
    const response = await connect();
    if (response && response.addresses && response.addresses.length > 0) {
      const stxAddr = response.addresses.find(a =>
        USE_TESTNET ? a.address.startsWith("ST") : a.address.startsWith("SP")
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
    const { openContractCall } = await import('@stacks/connect');
    const { stringAsciiCV, bufferCV } = await import('@stacks/transactions');
    const safeTitle = (title || "Untitled").replace(/[^\x00-\x7F]/g, "").slice(0, 100);
    const safeType = (docType || "other").replace(/[^\x00-\x7F]/g, "").slice(0, 50);
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "store",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV(safeTitle),
        stringAsciiCV(safeType),
      ],
      network: NETWORK,
      onFinish: (data) => {
        onSuccess(data.txId);
      },
      onCancel: () => {
        if (onError) onError("Transaction cancelled");
      },
    });
  } catch (e) {
    console.error("Anchor error:", e);
    if (onError) onError(e.message);
  }
}

async function verifyDocument(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import('@stacks/transactions');
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-doc",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });
    const json = cvToJSON(result);
    if (!json.value || !json.value.value) return null;
    const data = json.value.value;
    return {
      owner: data.owner.value,
      block: data["block-height"].value,
      title: data.title.value,
      docType: data["doc-type"].value,
    };
  } catch (e) {
    console.error("Verify error:", e);
    return null;
  }
}

async function getWalletCount(owner) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV } = await import('@stacks/transactions');
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-wallet-count",
      functionArgs: [standardPrincipalCV(owner)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
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
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import('@stacks/transactions');
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-wallet-doc-at",
      functionArgs: [standardPrincipalCV(owner), uintCV(index)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
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
      docType: data["doc-type"].value,
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
    const { openContractCall } = await import('@stacks/connect');
    const { bufferCV, stringAsciiCV } = await import('@stacks/transactions');
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CRED_CONTRACT,
      functionName: "attest",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV((credentialType || "verified").slice(0, 50)),
      ],
      network: NETWORK,
      onFinish: (data) => onSuccess(data.txId),
      onCancel: () => { if (onError) onError("Cancelled"); },
    });
  } catch (e) {
    console.error("Attest error:", e);
    if (onError) onError(e.message);
  }
}

async function getDocumentAttestations(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON, uintCV, standardPrincipalCV } = await import('@stacks/transactions');

    const countResult = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CRED_CONTRACT,
      functionName: "get-attestation-count",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    const count = parseInt(cvToJSON(countResult).value) || 0;
    if (count === 0) return [];

    const attestations = [];
    for (let i = 0; i < count; i++) {
      const issuerResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CRED_CONTRACT,
        functionName: "get-issuer-at",
        functionArgs: [bufferCV(Buffer.from(hexHash, "hex")), uintCV(i)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const issuerJson = cvToJSON(issuerResult);
      if (!issuerJson.value || !issuerJson.value.value) continue;
      const issuer = issuerJson.value.value;

      const attResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CRED_CONTRACT,
        functionName: "get-attestation",
        functionArgs: [
          bufferCV(Buffer.from(hexHash, "hex")),
          standardPrincipalCV(issuer),
        ],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const attJson = cvToJSON(attResult);
      if (!attJson.value || !attJson.value.value) continue;
      const att = attJson.value.value;

      if (att.active.value) {
        attestations.push({
          issuer,
          credentialType: att["credential-type"].value,
          issuedAt: att["issued-at"].value,
        });
      }
    }
    return attestations;
  } catch (e) {
    console.error("Get attestations error:", e);
    return [];
  }
}


const ACHIEVEMENT_TYPES = {
  diploma: { label: "Certified Graduate", icon: "🎓" },
  research: { label: "Verified Researcher", icon: "🔬" },
  art: { label: "Certified Creator", icon: "🎨" },
  certificate: { label: "Certified Professional", icon: "📜" },
  contribution: { label: "Open Source Contributor", icon: "💻" },
  award: { label: "Achievement Unlocked", icon: "🏆" },
  other: { label: "Verified Achievement", icon: "⭐" },
};

function getAchievementMeta(docType) {
  return ACHIEVEMENT_TYPES[docType] || ACHIEVEMENT_TYPES.other;
}

async function mintAchievement(hexHash, docType, title, onSuccess, onError) {
  try {
    const { openContractCall } = await import('@stacks/connect');
    const { bufferCV, stringAsciiCV } = await import('@stacks/transactions');
    const meta = getAchievementMeta(docType);
    await openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: NFT_CONTRACT,
      functionName: "mint",
      functionArgs: [
        bufferCV(Buffer.from(hexHash, "hex")),
        stringAsciiCV(meta.label.slice(0, 50)),
        stringAsciiCV((title || "Untitled").replace(/[^\x00-\x7F]/g, "").slice(0, 100)),
      ],
      network: NETWORK,
      onFinish: (data) => onSuccess(data.txId),
      onCancel: () => { if (onError) onError("Cancelled"); },
    });
  } catch (e) {
    console.error("Mint error:", e);
    if (onError) onError(e.message);
  }
}

async function getTokenByHash(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import('@stacks/transactions');
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: NFT_CONTRACT,
      functionName: "get-token-by-hash",
      functionArgs: [bufferCV(Buffer.from(hexHash, "hex"))],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
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
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import('@stacks/transactions');
    const countResult = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: NFT_CONTRACT,
      functionName: "get-wallet-achievement-count",
      functionArgs: [standardPrincipalCV(owner)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });
    const count = parseInt(cvToJSON(countResult).value) || 0;
    if (count === 0) return [];
    const achievements = [];
    for (let i = 0; i < count; i++) {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: NFT_CONTRACT,
        functionName: "get-wallet-achievement-at",
        functionArgs: [standardPrincipalCV(owner), uintCV(i)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });
      const json = cvToJSON(result);
      if (!json.value || !json.value.value) continue;
      const data = json.value.value;
      achievements.push({
        achievementType: data["achievement-type"].value,
        title: data.title.value,
        mintedAt: data["minted-at"].value,
        owner: data.owner.value,
      });
    }
    return achievements;
  } catch (e) {
    console.error("Achievements error:", e);
    return [];
  }
}
const REPUTATION_SCORES = {
  diploma: 50,
  research: 40,
  certificate: 30,
  art: 20,
  contribution: 20,
  award: 10,
  other: 10,
};

const REPUTATION_TIERS = [
  { min: 1000, label: "Legend", color: "#F7931A" },
  { min: 500, label: "Authority", color: "#a78bfa" },
  { min: 250, label: "Expert", color: "#22c55e" },
  { min: 100, label: "Contributor", color: "#38bdf8" },
  { min: 0, label: "Builder", color: "#666" },
];

function getTier(score) {
  return REPUTATION_TIERS.find(t => score >= t.min) || REPUTATION_TIERS[4];
}

async function computeReputation(owner) {
  try {
    const [docs, achievements] = await Promise.all([
      getWalletProfile(owner),
      getWalletAchievements(owner),
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
        reason: "Anchored document",
      });

      const attestations = doc.hash
        ? await getDocumentAttestations(doc.hash)
        : [];

      if (attestations.length > 0) {
        const attPoints = attestations.length * 10;
        score += attPoints;
        breakdown.push({
          label: doc.title,
          type: "attestation",
          points: attPoints,
          reason: `${attestations.length} attestation${attestations.length > 1 ? "s" : ""}`,
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
        reason: `${achievements.length} achievement NFT${achievements.length > 1 ? "s" : ""}`,
      });
    }

    return {
      score,
      breakdown,
      tier: getTier(score),
      docCount: docs.length,
      attCount: docs.reduce(async (acc, doc) => acc, 0),
      nftCount: achievements.length,
    };
  } catch (e) {
    console.error("Reputation error:", e);
    return { score: 0, breakdown: [], tier: getTier(0), docCount: 0, nftCount: 0 };
  }
}

const API$1 = "https://api.hiro.so";
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
async function getAccountInfo(address) {
  const res = await fetchWithRetry(`${API$1}/v2/accounts/${address}?proof=0`);
  return res.json();
}
async function getContractTxs(contractId, limit = 50, offset = 0) {
  const res = await fetchWithRetry(`${API$1}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`);
  return res.json();
}
async function getNetworkInfo() {
  const res = await fetchWithRetry(`${API$1}/v2/info`);
  return res.json();
}

async function prepareProof(input, title, docType) {
  if (!title?.trim()) throw new Error("Title is required");
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
  return `I just anchored "${title}" to Bitcoin via ProofLedger.\n\nVerify: ${buildProofUrl(hash)}\n\n#Bitcoin #Stacks #ProofOfExistence`;
}

const DOC_TYPES$1 = ["diploma","certificate","research","art","contribution","award","other"];

function validateProofInput({ hash, title, docType }) {
  const errors = {};

  if (!hash) {
    errors.hash = "Hash is required";
  } else if (!isValidSha256(hash)) {
    errors.hash = "Must be a valid SHA-256 hash (64 hex chars)";
  }

  if (!title?.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be 100 characters or less";
  } else if (!/^[\x00-\x7F]*$/.test(title)) {
    errors.title = "Title must be ASCII characters only";
  }

  if (!docType) {
    errors.docType = "Document type is required";
  } else if (!DOC_TYPES$1.includes(docType)) {
    errors.docType = `Must be one of: ${DOC_TYPES$1.join(", ")}`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function sanitizeTitle(title) {
  return title?.trim().replace(/[^\x00-\x7F]/g, "").slice(0, 100) || "";
}

const store = new Map();

async function cacheWrap(key, fn, ttlMs = 60_000) {
  const existing = store.get(key);
  if (existing && Date.now() < existing.expires) return existing.value;
  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function callReadOnly(contractName, fnName, args) {
  const res = await fetch(`${API}/v2/contracts/call-read/${CONTRACT}/${contractName}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: CONTRACT, arguments: args }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}

const ProofLedgerClient = {
  verify: (hash) =>
    cacheWrap(`verify:${hash}`,
      () => callReadOnly("proofleger3", "get-doc", ["0x0200000020" + hash]),
      300_000),

  getProfile: (address) =>
    cacheWrap(`profile:${address}`,
      () => fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
      60_000),

  getTxCount: (address) =>
    fetch(`${API}/extended/v1/address/${address}/transactions?limit=1`)
      .then(r => r.json())
      .then(d => d.total || 0),

  getNetworkInfo: () =>
    cacheWrap("network:info",
      () => fetch(`${API}/v2/info`).then(r => r.json()),
      30_000),
};

const PREFIX = "proofleger:";
function storageGet(key, fallback = null) {
  try { const v = localStorage.getItem(PREFIX + key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function storageSet(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
  catch { return false; }
}
function storageRemove(key) {
  try { localStorage.removeItem(PREFIX + key); return true; }
  catch { return false; }
}
const KEYS = {
  WALLET_ADDRESS: "wallet_address",
  PREFERRED_NETWORK: "preferred_network",
  RECENT_HASHES: "recent_hashes",
  DRAFT_TITLE: "draft_title",
  DRAFT_TYPE: "draft_type",
};

/**
 * ProofLedger Application Constants
 */

// ── Stacks ────────────────────────────────────────────────
const STACKS_CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const STACKS_CONTRACT_NAME    = "proofleger3";
const STACKS_API              = "https://api.hiro.so";
const STACKS_EXPLORER         = "https://explorer.hiro.so";

// ── Celo ──────────────────────────────────────────────────
const CELO_CHAIN_ID      = 42220;
const CELO_RPC           = "https://feth.celo.org";
const CELO_EXPLORER      = "https://celoscan.io";

// ── Limits ────────────────────────────────────────────────
const MAX_TITLE_LENGTH  = 100;
const LARGE_FILE_MB     = 5;
const HASH_CHUNK_SIZE   = 2 * 1024 * 1024; // 2MB

// ── Cache keys ────────────────────────────────────────────
const CACHE_KEYS = {
  proofHistory:   "pl:proof-history",
  networkPref:    "pl:network",
  walletAddress:  "pl:wallet-address",
  recentHashes:   "pl:recent-hashes",
};

// ── Timing ────────────────────────────────────────────────
const STACKS_BLOCK_TIME_SECS = 600;  // ~10 min
const CELO_BLOCK_TIME_SECS   = 5;    // ~5 sec
const CLIPBOARD_RESET_MS     = 1800;

/**
 * @fileoverview Utility functions for formatting values in ProofLedger UI
 * Handles hash display, STX amounts, dates, and wallet addresses
 */

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
  if (microStx === null || microStx === undefined) return "0 STX";
  const stx = Number(microStx) / 1_000_000;
  return `${stx.toFixed(decimals)} STX`;
}

function formatDate(timestamp, options = {}) {
  if (!timestamp) return "Unknown date";
  const defaults = { year: "numeric", month: "short", day: "numeric" };
  return new Date(timestamp * 1000).toLocaleDateString("en-US", { ...defaults, ...options });
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
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(timestamp);
}

/**
 * ProofLedger client-side SHA-256 hashing utilities
 */

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

async function hashFile(file, onProgress) {
  if (!window.crypto?.subtle) throw new Error("SubtleCrypto not available");

  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  const buffers = [];

  for (let i = 0; i < chunks; i++) {
    const start  = i * CHUNK_SIZE;
    const end    = Math.min(start + CHUNK_SIZE, file.size);
    const slice  = file.slice(start, end);
    const buf    = await slice.arrayBuffer();
    buffers.push(buf);
    onProgress?.(Math.round(((i + 1) / chunks) * 100));
  }

  // Concatenate all chunks
  const total  = buffers.reduce((s, b) => s + b.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset   = 0;
  for (const buf of buffers) {
    merged.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  const hashBuf = await window.crypto.subtle.digest("SHA-256", merged);
  return bufToHex(hashBuf);
}

async function hashText(text) {
  if (!window.crypto?.subtle) throw new Error("SubtleCrypto not available");
  const encoded = new TextEncoder().encode(text);
  const hashBuf = await window.crypto.subtle.digest("SHA-256", encoded);
  return bufToHex(hashBuf);
}

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function isHexHash(str) {
  return /^[0-9a-f]{64}$/i.test(str?.replace(/^0x/i, ""));
}

function isStacksAddress(addr) {
  return typeof addr === "string" &&
    (addr.startsWith("SP") || addr.startsWith("ST")) &&
    addr.length >= 30 && addr.length <= 52;
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
  return addr?.slice(0, chars) + "..." || "";
}

function getAddressType(addr) {
  if (isStacksAddress(addr)) return "stacks";
  if (isCeloAddress(addr)) return "celo";
  return "unknown";
}

/**
 * ProofLedger input validation utilities
 */

// Validates a 64-char lowercase hex SHA-256 hash
function isValidHash(hash) {
  if (!hash || typeof hash !== "string") return false;
  const clean = hash.replace(/^0x/i, "");
  return /^[0-9a-f]{64}$/i.test(clean);
}

// Validates a Stacks principal (standard or contract)
function isValidStacksAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^SP[A-Z0-9]{33,41}/.test(address);
}

// Validates an EVM address (Celo / Ethereum)
function isValidEvmAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

// Validates doc title constraints (Clarity string-ascii 100)
function isValidTitle(title) {
  if (!title || typeof title !== "string") return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 100 &&
    /^[\x00-\x7F]*$/.test(trimmed); // ASCII only
}

const DOC_TYPES = ["diploma", "certificate", "research", "contribution", "award", "art", "other"];

function isValidDocType(type) {
  return DOC_TYPES.includes(type);
}

export { CACHE_KEYS, CELO_BLOCK_TIME_SECS, CELO_CHAIN_ID, CELO_EXPLORER, CELO_RPC, CLIPBOARD_RESET_MS, HASH_CHUNK_SIZE, KEYS, LARGE_FILE_MB, MAX_TITLE_LENGTH, ProofLedgerClient, STACKS_API, STACKS_BLOCK_TIME_SECS, STACKS_CONTRACT_ADDRESS, STACKS_CONTRACT_NAME, STACKS_EXPLORER, anchorDocument, attestDocument, buildProofUrl, buildShareText, computeReputation, connectWallet, disconnectWallet, fetchAchievementNFTs, fetchAddressTransactions, fetchBalance, fetchBlockHeight, fetchContractTxs, formatBlock, formatDate, formatDocType, formatFileSize, formatStx, getAccountInfo, getAchievementMeta, getAddress, getAddressType, getContractTxs, getDocumentAttestations, getNetworkInfo, getTier, getTokenByHash, getWalletAchievements, getWalletCount, getWalletDocAt, getWalletProfile, hashFile, hashText, isCeloAddress, isHexHash, isStacksAddress, isValidDocType, isValidEvmAddress, isValidHash, isValidStacksAddress, isValidTitle, isWalletConnected, mintAchievement, prepareProof, sanitizeTitle, shortenAddress, shortenCeloAddress, shortenStacksAddress, storageGet, storageRemove, storageSet, timeAgo, truncateAddress, truncateHash, validateProofInput, verifyDocument };
