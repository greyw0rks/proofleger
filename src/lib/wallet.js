"use client";

const USE_TESTNET = false;
const CONTRACT_ADDRESS = USE_TESTNET
  ? "ST1SY1E599GN04XRD2DQBKV7E62HYBJR2CSC3MXNA"
  : "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACT_NAME = "proofleger3";
const NETWORK = USE_TESTNET ? "testnet" : "mainnet";
const CRED_CONTRACT = "credentials";
const NFT_CONTRACT = "achievements";

export async function connectWallet({ onSuccess, onCancel }) {
  try {
    const { connect } = await import("@stacks/connect");
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

export function disconnectWallet() {
  localStorage.removeItem("proofleger_address");
}

export function isWalletConnected() {
  try {
    return !!localStorage.getItem("proofleger_address");
  } catch {
    return false;
  }
}

export function getAddress() {
  try {
    return localStorage.getItem("proofleger_address");
  } catch {
    return null;
  }
}

export async function anchorDocument(hexHash, title, docType, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { stringAsciiCV, bufferCV } = await import("@stacks/transactions");
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

export async function verifyDocument(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import("@stacks/transactions");
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

export async function getWalletCount(owner) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV } = await import("@stacks/transactions");
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

export async function getWalletDocAt(owner, index) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import("@stacks/transactions");
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

export async function getWalletProfile(owner) {
  const count = await getWalletCount(owner);
  if (count === 0) return [];
  const promises = Array.from({ length: count }, (_, i) => getWalletDocAt(owner, i));
  const docs = await Promise.all(promises);
  return docs.filter(Boolean);
}


export async function attestDocument(hexHash, credentialType, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { bufferCV, stringAsciiCV } = await import("@stacks/transactions");
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

export async function getDocumentAttestations(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON, uintCV, standardPrincipalCV } = await import("@stacks/transactions");

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

export function getAchievementMeta(docType) {
  return ACHIEVEMENT_TYPES[docType] || ACHIEVEMENT_TYPES.other;
}

export async function mintAchievement(hexHash, docType, title, onSuccess, onError) {
  try {
    const { openContractCall } = await import("@stacks/connect");
    const { bufferCV, stringAsciiCV } = await import("@stacks/transactions");
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

export async function getTokenByHash(hexHash) {
  try {
    const { fetchCallReadOnlyFunction, bufferCV, cvToJSON } = await import("@stacks/transactions");
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

export async function getWalletAchievements(owner) {
  try {
    const { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } = await import("@stacks/transactions");
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

export function getTier(score) {
  return REPUTATION_TIERS.find(t => score >= t.min) || REPUTATION_TIERS[4];
}

export async function computeReputation(owner) {
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
