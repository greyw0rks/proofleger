#!/bin/bash
# ProofLedger - Add Celo Network to existing proofleger repo
# Run: bash add_celo.sh
# Adds: Celo contracts, MiniPay hook, wallet-celo.js, network switcher UI

set -e
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

echo -e "${YELLOW}Adding Celo to ProofLedger...${NC}"

cd ~/proofleger

# ============================================================
# COMMIT 1: Solidity contracts
# ============================================================

mkdir -p contracts/celo

cat > contracts/celo/ProofLedger.sol << 'ENDOFFILE'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofLedger
 * @author greyw0rks
 * @notice Anchor SHA-256 document hashes on Celo. MiniPay compatible.
 */
contract ProofLedger {

    struct Document {
        address owner;
        uint256 blockNumber;
        uint256 timestamp;
        string title;
        string docType;
        uint256 attestationCount;
        bool exists;
    }

    mapping(bytes32 => Document) public documents;
    mapping(address => uint256) public documentCount;
    mapping(address => mapping(uint256 => bytes32)) public ownerDocuments;
    mapping(bytes32 => mapping(address => bool)) public hasAttested;
    uint256 public totalDocuments;

    event DocumentAnchored(bytes32 indexed hash, address indexed owner, string title, string docType, uint256 blockNumber);
    event DocumentAttested(bytes32 indexed hash, address indexed attester);

    error AlreadyAnchored();
    error NotFound();
    error AlreadyAttested();
    error CannotAttestOwnDocument();
    error EmptyTitle();

    function anchorDocument(bytes32 hash, string calldata title, string calldata docType) external {
        if (documents[hash].exists) revert AlreadyAnchored();
        if (bytes(title).length == 0) revert EmptyTitle();

        documents[hash] = Document({
            owner: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp,
            title: title,
            docType: docType,
            attestationCount: 0,
            exists: true
        });

        ownerDocuments[msg.sender][documentCount[msg.sender]] = hash;
        documentCount[msg.sender]++;
        totalDocuments++;

        emit DocumentAnchored(hash, msg.sender, title, docType, block.number);
    }

    function attestDocument(bytes32 hash, string calldata credentialType) external {
        if (!documents[hash].exists) revert NotFound();
        if (documents[hash].owner == msg.sender) revert CannotAttestOwnDocument();
        if (hasAttested[hash][msg.sender]) revert AlreadyAttested();

        hasAttested[hash][msg.sender] = true;
        documents[hash].attestationCount++;

        emit DocumentAttested(hash, msg.sender);
    }

    function verifyDocument(bytes32 hash) external view returns (Document memory) {
        return documents[hash];
    }

    function getOwnerDocument(address owner, uint256 index) external view returns (bytes32) {
        return ownerDocuments[owner][index];
    }
}
ENDOFFILE

cat > contracts/celo/ProofLedgerCredentials.sol << 'ENDOFFILE'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofLedgerCredentials
 * @author greyw0rks
 * @notice Issue and revoke verifiable credentials on Celo. MiniPay compatible.
 */
contract ProofLedgerCredentials {

    struct Credential {
        address issuer;
        address recipient;
        bytes32 documentHash;
        string credentialType;
        string issuerName;
        uint256 issuedAt;
        bool revoked;
        bool exists;
    }

    mapping(address => mapping(bytes32 => Credential)) public credentials;
    mapping(address => uint256) public credentialCount;

    event CredentialIssued(address indexed issuer, address indexed recipient, bytes32 indexed documentHash, string credentialType);
    event CredentialRevoked(address indexed issuer, address indexed recipient, bytes32 indexed documentHash);

    error AlreadyIssued();
    error NotFound();
    error NotAuthorized();
    error AlreadyRevoked();

    function issueCredential(address recipient, bytes32 documentHash, string calldata credentialType, string calldata issuerName) external {
        if (credentials[recipient][documentHash].exists) revert AlreadyIssued();

        credentials[recipient][documentHash] = Credential({
            issuer: msg.sender, recipient: recipient, documentHash: documentHash,
            credentialType: credentialType, issuerName: issuerName,
            issuedAt: block.timestamp, revoked: false, exists: true
        });

        credentialCount[recipient]++;
        emit CredentialIssued(msg.sender, recipient, documentHash, credentialType);
    }

    function revokeCredential(address recipient, bytes32 documentHash) external {
        Credential storage cred = credentials[recipient][documentHash];
        if (!cred.exists) revert NotFound();
        if (cred.issuer != msg.sender) revert NotAuthorized();
        if (cred.revoked) revert AlreadyRevoked();
        cred.revoked = true;
        emit CredentialRevoked(msg.sender, recipient, documentHash);
    }

    function getCredential(address recipient, bytes32 documentHash) external view returns (Credential memory) {
        return credentials[recipient][documentHash];
    }

    function isValidCredential(address recipient, bytes32 documentHash) external view returns (bool) {
        Credential memory cred = credentials[recipient][documentHash];
        return cred.exists && !cred.revoked;
    }
}
ENDOFFILE

cat > contracts/celo/hardhat.config.js << 'ENDOFFILE'
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    celo: {
      url: "https://feth.celo.org",
      chainId: 42220,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    celoSepolia: {
      url: "https://alfajores-faucet.celo-testnet.org",
      chainId: 44787,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
ENDOFFILE

cat > contracts/celo/deploy.js << 'ENDOFFILE'
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying to ${hre.network.name} from ${deployer.address}`);

  const ProofLedger = await hre.ethers.getContractFactory("ProofLedger");
  const proofLedger = await ProofLedger.deploy();
  await proofLedger.waitForDeployment();
  console.log(`ProofLedger: ${await proofLedger.getAddress()}`);

  const Credentials = await hre.ethers.getContractFactory("ProofLedgerCredentials");
  const credentials = await Credentials.deploy();
  await credentials.waitForDeployment();
  console.log(`Credentials: ${await credentials.getAddress()}`);

  console.log("\nUpdate CELO_CONTRACT_ADDRESS in src/lib/wallet-celo.js");
}

main().catch(err => { console.error(err); process.exit(1); });
ENDOFFILE

git add contracts/celo/
git commit -m "Add Celo smart contracts: ProofLedger.sol and ProofLedgerCredentials.sol"
echo -e "${GREEN}Commit 1 done: Celo contracts${NC}"
sleep 2

# ============================================================
# COMMIT 2: useMiniPay hook
# ============================================================

mkdir -p src/hooks
cat > src/hooks/useMiniPay.js << 'ENDOFFILE'
"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * useMiniPay - Detects MiniPay wallet and auto-connects
 *
 * MiniPay injects window.ethereum with isMiniPay = true.
 * Inside MiniPay the address is available immediately with no user action.
 * Outside MiniPay it falls back to standard window.ethereum.
 *
 * @returns {{ isMiniPay, address, connected, connect, error }}
 */
export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const detected = window.ethereum?.isMiniPay === true;
    setIsMiniPay(detected);
    if (detected) autoConnect();
  }, []);

  async function autoConnect() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts[0]) { setAddress(accounts[0]); setConnected(true); }
    } catch (err) { setError(err.message); }
  }

  const connect = useCallback(async () => {
    try {
      setError(null);
      if (!window.ethereum) throw new Error("No wallet found. Install MiniPay or MetaMask.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts[0]) { setAddress(accounts[0]); setConnected(true); }
    } catch (err) { setError(err.message); }
  }, []);

  return { isMiniPay, address, connected, connect, error };
}
ENDOFFILE

git add src/hooks/useMiniPay.js
git commit -m "Add useMiniPay hook: MiniPay detection and auto-connect for Celo network"
echo -e "${GREEN}Commit 2 done: useMiniPay hook${NC}"
sleep 2

# ============================================================
# COMMIT 3: wallet-celo.js
# ============================================================

cat > src/lib/wallet-celo.js << 'ENDOFFILE'
/**
 * wallet-celo.js
 * Celo blockchain interactions for ProofLedger
 * Uses viem with Celo chain — MiniPay compatible
 *
 * Update CELO_CONTRACT_ADDRESS after deploying ProofLedger.sol to Celo mainnet
 */

// ─── Update these after deployment ──────────────────────────
export const CELO_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
export const CELO_CREDENTIALS_ADDRESS = "0x0000000000000000000000000000000000000000";
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
ENDOFFILE

git add src/lib/wallet-celo.js
git commit -m "Add wallet-celo.js: viem-based Celo contract interactions, MiniPay compatible"
echo -e "${GREEN}Commit 3 done: wallet-celo.js${NC}"
sleep 2

# ============================================================
# COMMIT 4: Network switcher + updated page.js
# ============================================================

cat > src/components/NetworkSwitcher.jsx << 'ENDOFFILE'
"use client";

/**
 * NetworkSwitcher - Toggle between Stacks and Celo networks
 *
 * @param {{ network: "stacks"|"celo", onChange: function }} props
 */
export default function NetworkSwitcher({ network, onChange }) {
  const networks = [
    { id: "stacks", label: "STACKS", sub: "Bitcoin L2" },
    { id: "celo",   label: "CELO",   sub: "MiniPay" },
  ];

  return (
    <div style={{ display: "flex", gap: "0", marginBottom: "0" }}>
      {networks.map((n) => {
        const active = network === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            style={{
              padding: "10px 24px",
              background: active ? "#F7931A" : "transparent",
              color: active ? "#0a0a0a" : "#f5f0e8",
              border: "3px solid " + (active ? "#F7931A" : "#f5f0e8"),
              borderRight: n.id === "stacks" ? "none" : "3px solid " + (active ? "#F7931A" : "#f5f0e8"),
              fontFamily: "Archivo Black, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
              letterSpacing: "1px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              transition: "all 0.1s",
              boxShadow: active ? "3px 3px 0px #d4780f" : "none",
            }}
          >
            <span>{n.label}</span>
            <span style={{ fontSize: "9px", opacity: 0.7, fontFamily: "Space Mono, monospace", fontWeight: "normal" }}>
              {n.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
ENDOFFILE

git add src/components/NetworkSwitcher.jsx
git commit -m "Add NetworkSwitcher component: Stacks/Celo toggle with active state"
echo -e "${GREEN}Commit 4 done: NetworkSwitcher${NC}"
sleep 2

# ============================================================
# COMMIT 5: Updated page.js with network switcher
# ============================================================

# Backup existing page.js
cp src/app/page.js src/app/page.js.bak2

cat > src/app/page.js << 'ENDOFFILE'
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import { useMiniPay } from "@/hooks/useMiniPay";
import { isWalletConnected, getAddress, anchorDocument, verifyDocument, attestDocument, mintAchievement, getAchievementMeta } from "@/lib/wallet";
import { anchorDocumentCelo, verifyDocumentCelo, attestDocumentCelo, CELO_EXPLORER } from "@/lib/wallet-celo";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --black: #0a0a0a;
    --white: #f5f0e8;
    --orange: #F7931A;
    --orange-dark: #d4780f;
    --green: #00ff88;
    --celo-green: #35D07F;
    --celo-yellow: #FCFF52;
    --red: #ff3333;
    --border: 3px solid #f5f0e8;
    --shadow: 6px 6px 0px #f5f0e8;
    --shadow-orange: 6px 6px 0px #F7931A;
    --shadow-sm: 3px 3px 0px #f5f0e8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
  }

  ::selection { background: var(--orange); color: #000; }

  .app { max-width: 960px; margin: 0 auto; padding: 0 24px 100px; }

  .header {
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border);
    margin-bottom: 0;
  }

  .logo { display: flex; align-items: center; gap: 12px; }
  .logo-box {
    width: 40px; height: 40px;
    border: 3px solid var(--white);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    box-shadow: 3px 3px 0px var(--orange);
  }
  .logo-text { font-family: 'Archivo Black', sans-serif; font-size: 20px; letter-spacing: 1px; }
  .logo-text span { color: var(--orange); }

  .hero {
    padding: 48px 0 32px;
    border-bottom: var(--border);
  }
  .hero-tag {
    display: inline-block;
    border: 2px solid var(--orange);
    color: var(--orange);
    padding: 4px 12px;
    font-size: 11px;
    font-family: 'Archivo Black', sans-serif;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(32px, 6vw, 56px);
    line-height: 1.05;
    letter-spacing: -1px;
    margin-bottom: 16px;
  }
  .hero h1 .outline {
    -webkit-text-stroke: 2px var(--white);
    color: transparent;
  }
  .hero p {
    font-size: 16px;
    color: #999;
    max-width: 500px;
    line-height: 1.6;
  }

  .network-bar {
    padding: 20px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .network-label {
    font-size: 11px;
    color: #666;
    font-family: 'Space Mono', monospace;
    letter-spacing: 1px;
  }

  .celo-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 2px solid var(--celo-green);
    color: var(--celo-green);
    padding: 3px 10px;
    font-size: 11px;
    font-family: 'Archivo Black', sans-serif;
    letter-spacing: 1px;
  }

  .tabs-row {
    display: flex;
    margin-top: 32px;
    border-bottom: none;
  }
  .tab-btn {
    padding: 12px 28px;
    border: 3px solid var(--white);
    border-bottom: none;
    background: transparent;
    color: #666;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 1px;
    margin-right: -3px;
  }
  .tab-btn.active {
    background: var(--orange);
    color: var(--black);
    border-color: var(--orange);
    position: relative;
    z-index: 1;
  }

  .tab-panel {
    border: 3px solid var(--white);
    padding: 32px;
    box-shadow: var(--shadow);
    min-height: 300px;
  }

  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: #888;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    background: transparent;
    border: 3px solid var(--white);
    color: var(--white);
    padding: 12px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    outline: none;
  }
  .form-input:focus { border-color: var(--orange); }
  .form-select {
    width: 100%;
    background: var(--black);
    border: 3px solid var(--white);
    color: var(--white);
    padding: 12px 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    outline: none;
    cursor: pointer;
  }

  .file-drop {
    border: 3px dashed #444;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    margin-bottom: 20px;
  }
  .file-drop:hover { border-color: var(--orange); }
  .file-drop.active { border-color: var(--orange); border-style: solid; }

  .btn-primary {
    background: var(--orange);
    color: var(--black);
    border: 3px solid var(--orange);
    padding: 14px 32px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--orange-dark);
    letter-spacing: 1px;
    width: 100%;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .btn-primary:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0px var(--orange-dark); }
  .btn-primary:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--orange-dark); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-celo {
    background: var(--celo-green);
    border-color: var(--celo-green);
    box-shadow: 4px 4px 0px #259a5e;
  }
  .btn-celo:hover { box-shadow: 5px 5px 0px #259a5e; }

  .status-box {
    border: 3px solid;
    padding: 16px;
    margin-top: 20px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    word-break: break-all;
    line-height: 1.6;
  }
  .status-success { border-color: var(--green); color: var(--green); }
  .status-error   { border-color: var(--red); color: var(--red); }
  .status-info    { border-color: var(--white); color: var(--white); }

  .hash-display {
    background: #111;
    border: 2px solid #333;
    padding: 12px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--orange);
    word-break: break-all;
    margin-top: 8px;
  }

  .record-card {
    border: 3px solid var(--white);
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
  }
  .record-title { font-family: 'Archivo Black', sans-serif; font-size: 16px; margin-bottom: 8px; }
  .record-meta  { font-family: 'Space Mono', monospace; font-size: 11px; color: #888; line-height: 1.8; }
  .record-type  {
    display: inline-block;
    border: 2px solid var(--white);
    padding: 2px 8px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
    margin-bottom: 8px;
  }

  .minipay-banner {
    background: #0d1f16;
    border: 3px solid var(--celo-green);
    padding: 12px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--celo-green);
    font-family: 'Archivo Black', sans-serif;
  }

  .chain-pill {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
    border: 2px solid;
    margin-left: 8px;
    letter-spacing: 1px;
  }
  .chain-stacks { border-color: var(--orange); color: var(--orange); }
  .chain-celo   { border-color: var(--celo-green); color: var(--celo-green); }
`;

const DOC_TYPES = ["diploma","certificate","research","art","contribution","award","other"];

async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function Home() {
  const [network, setNetwork] = useState("stacks");
  const [tab, setTab] = useState("anchor");
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const [verifyHash, setVerifyHash] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  // Stacks wallet state
  const [stacksAddress, setStacksAddress] = useState(null);

  // Celo / MiniPay state
  const { isMiniPay, address: celoAddress, connected: celoConnected, connect: connectCelo } = useMiniPay();

  const activeAddress = network === "stacks" ? stacksAddress : celoAddress;
  const isConnected = network === "stacks" ? !!stacksAddress : celoConnected;

  useEffect(() => {
    const addr = getAddress();
    if (addr && isWalletConnected()) setStacksAddress(addr);
  }, []);

  // Auto-switch to Celo if inside MiniPay
  useEffect(() => {
    if (isMiniPay) setNetwork("celo");
  }, [isMiniPay]);

  async function handleFileChange(f) {
    if (!f) return;
    setFile(f);
    setStatus({ type: "info", msg: `Hashing ${f.name}...` });
    const h = await hashFile(f);
    setHash(h);
    setStatus({ type: "success", msg: `File hashed. Ready to anchor.` });
  }

  async function handleAnchor() {
    if (!isConnected) return setStatus({ type: "error", msg: "Connect your wallet first." });
    if (!hash) return setStatus({ type: "error", msg: "Select a file or enter a hash." });
    if (!title) return setStatus({ type: "error", msg: "Enter a document title." });
    setLoading(true);
    setStatus({ type: "info", msg: "Submitting to blockchain..." });
    try {
      if (network === "stacks") {
        await anchorDocument(hash, title, docType);
        setStatus({ type: "success", msg: `Anchored to Bitcoin via Stacks.\nHash: ${hash}` });
      } else {
        const txHash = await anchorDocumentCelo(hash, title, docType);
        setStatus({ type: "success", msg: `Anchored to Celo!\nTx: ${txHash}\n${CELO_EXPLORER}/tx/${txHash}` });
      }
    } catch (e) {
      setStatus({ type: "error", msg: e.message || "Transaction failed" });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!verifyHash.trim()) return setStatus({ type: "error", msg: "Enter a hash to verify." });
    setLoading(true);
    setStatus({ type: "info", msg: "Checking chain..." });
    try {
      let result;
      if (network === "stacks") {
        result = await verifyDocument(verifyHash.trim());
      } else {
        result = await verifyDocumentCelo(verifyHash.trim());
      }
      if (result) {
        setStatus({ type: "success", msg: `VERIFIED on ${network === "stacks" ? "Bitcoin/Stacks" : "Celo"}!\n\nTitle: ${result.title || "—"}\nType: ${result.docType || result["doc-type"] || "—"}\nOwner: ${result.owner}\nBlock: ${result.blockHeight || result["block-height"] || result.blockNumber || "—"}` });
      } else {
        setStatus({ type: "error", msg: "Document not found on chain." });
      }
    } catch (e) {
      setStatus({ type: "error", msg: e.message || "Verification failed" });
    } finally {
      setLoading(false);
    }
  }

  const isCelo = network === "celo";
  const accentColor = isCelo ? "var(--celo-green)" : "var(--orange)";

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <div className="logo-box">PL</div>
            <div className="logo-text">PROOF<span>LEDGER</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {network === "stacks" ? (
              <WalletButton onConnect={setStacksAddress} onDisconnect={() => setStacksAddress(null)} />
            ) : (
              celoConnected ? (
                <button style={{ border: "3px solid var(--celo-green)", background: "transparent", color: "var(--celo-green)", padding: "10px 16px", fontFamily: "Archivo Black, sans-serif", fontSize: "12px", cursor: "pointer" }}>
                  {celoAddress?.slice(0, 6)}...{celoAddress?.slice(-4)}
                </button>
              ) : (
                <button onClick={connectCelo} style={{ border: "3px solid var(--celo-green)", background: "var(--celo-green)", color: "#000", padding: "10px 20px", fontFamily: "Archivo Black, sans-serif", fontSize: "12px", cursor: "pointer", boxShadow: "3px 3px 0px #259a5e" }}>
                  {isMiniPay ? "CONNECTING..." : "CONNECT WALLET"}
                </button>
              )
            )}
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-tag">BITCOIN + CELO DOCUMENT PROOF</div>
          <h1>Anchor Documents<br/>to <span className="outline">Blockchain</span></h1>
          <p>SHA-256 hash your files client-side. Anchor the proof permanently. Verify existence without revealing content.</p>

          {/* NETWORK SWITCHER */}
          <div className="network-bar">
            <span className="network-label">NETWORK:</span>
            <NetworkSwitcher network={network} onChange={setNetwork} />
            {isMiniPay && (
              <span className="celo-badge">⚡ MiniPay Detected</span>
            )}
          </div>
        </section>

        {/* MINIPAY BANNER */}
        {isMiniPay && (
          <div className="minipay-banner">
            <span>⚡</span>
            <span>Running inside MiniPay — wallet auto-connected</span>
          </div>
        )}

        {/* TABS */}
        <div className="tabs-row">
          {["anchor","verify","records"].map(t => (
            <button key={t} className={`tab-btn${tab === t ? " active" : ""}`}
              onClick={() => { setTab(t); setStatus(null); }}
              style={tab === t ? { background: accentColor, borderColor: accentColor } : {}}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TAB PANEL */}
        <div className="tab-panel">

          {/* ANCHOR */}
          {tab === "anchor" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                Hash your document locally, then anchor the proof to{" "}
                <span className="chain-pill" style={{ borderColor: accentColor, color: accentColor }}>
                  {isCelo ? "CELO" : "STACKS"}
                </span>
              </p>

              {/* File drop */}
              <div className={`file-drop${dragging ? " active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => handleFileChange(e.target.files[0])} />
                <p style={{ fontFamily: "Archivo Black, sans-serif", fontSize: "14px", marginBottom: "8px" }}>
                  {file ? file.name : "DROP FILE OR CLICK TO SELECT"}
                </p>
                <p style={{ fontSize: "12px", color: "#666" }}>Never uploaded — hashed locally in your browser</p>
              </div>

              {hash && <div className="hash-display">{hash}</div>}

              <div className="form-group" style={{ marginTop: "20px" }}>
                <label className="form-label">DOCUMENT TITLE</label>
                <input className="form-input" placeholder="e.g. Bachelor of Science — MIT 2024" value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">DOCUMENT TYPE</label>
                <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              <button className={`btn-primary${isCelo ? " btn-celo" : ""}`}
                onClick={handleAnchor} disabled={loading || !hash || !title}>
                {loading ? "ANCHORING..." : `ANCHOR TO ${isCelo ? "CELO" : "BITCOIN"}`}
              </button>

              {status && (
                <div className={`status-box status-${status.type}`} style={{ whiteSpace: "pre-line" }}>
                  {status.msg}
                </div>
              )}
            </div>
          )}

          {/* VERIFY */}
          {tab === "verify" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                Enter a SHA-256 hash to verify it was anchored on{" "}
                <span className="chain-pill" style={{ borderColor: accentColor, color: accentColor }}>
                  {isCelo ? "CELO" : "STACKS"}
                </span>
              </p>

              <div className="form-group">
                <label className="form-label">SHA-256 HASH</label>
                <input className="form-input" placeholder="64 hex characters..." value={verifyHash} onChange={e => setVerifyHash(e.target.value)} />
              </div>

              <button className={`btn-primary${isCelo ? " btn-celo" : ""}`}
                onClick={handleVerify} disabled={loading || !verifyHash.trim()}>
                {loading ? "VERIFYING..." : `VERIFY ON ${isCelo ? "CELO" : "BITCOIN"}`}
              </button>

              {status && (
                <div className={`status-box status-${status.type}`} style={{ whiteSpace: "pre-line" }}>
                  {status.msg}
                </div>
              )}
            </div>
          )}

          {/* RECORDS */}
          {tab === "records" && (
            <div>
              <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
                {isConnected
                  ? `Showing records for ${activeAddress?.slice(0, 6)}...${activeAddress?.slice(-4)} on ${isCelo ? "Celo" : "Stacks"}`
                  : "Connect your wallet to view your records."}
              </p>
              {records.length === 0 && isConnected && (
                <div style={{ border: "3px dashed #333", padding: "40px", textAlign: "center", color: "#555", fontFamily: "Archivo Black, sans-serif" }}>
                  NO RECORDS FOUND
                </div>
              )}
              {records.map((r, i) => (
                <div key={i} className="record-card">
                  <div className="record-type">{r.docType}</div>
                  <div className="record-title">{r.title}</div>
                  <div className="record-meta">
                    Block: {r.blockHeight || r.blockNumber}<br/>
                    Hash: {r.hash?.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
ENDOFFILE

git add src/app/page.js src/components/NetworkSwitcher.jsx
git commit -m "Add Celo network switcher: Stacks/Celo toggle with MiniPay auto-detect"
echo -e "${GREEN}Commit 5 done: page.js with network switcher${NC}"
sleep 2

# ============================================================
# COMMIT 6: Update package.json with viem/wagmi deps
# ============================================================

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['viem'] = '^2.0.0';
pkg.dependencies['wagmi'] = '^2.0.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json updated');
"

git add package.json
git commit -m "Add viem and wagmi dependencies for Celo network support"
echo -e "${GREEN}Commit 6 done: package.json${NC}"
sleep 2

git push origin main
echo -e "${GREEN}All 6 commits pushed to proofleger repo${NC}"

# ============================================================
# INSTALL DEPS
# ============================================================
echo -e "${YELLOW}Installing viem and wagmi...${NC}"
npm install viem wagmi
echo -e "${GREEN}Dependencies installed${NC}"

echo ""
echo -e "${GREEN}================================================"
echo "DONE. ProofLedger now supports Celo + MiniPay."
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Deploy Celo contracts:"
echo "   cd ~/proofleger"
echo "   export DEPLOYER_PRIVATE_KEY=your_celo_private_key"
echo "   cd contracts/celo"
echo "   npm init -y && npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox"
echo "   npx hardhat compile"
echo "   npx hardhat run deploy.js --network celo"
echo ""
echo "2. Update contract address:"
echo "   nano src/lib/wallet-celo.js"
echo "   Set CELO_CONTRACT_ADDRESS to the deployed address"
echo ""
echo "3. Deploy to Vercel:"
echo "   git push → auto-deploys on Vercel"
echo ""
echo "4. Submit on Talent Protocol:"
echo "   talent.app/~/earn/celo-proof-of-ship"
echo "   Data sources: proofleger repo + Celo contract address"
echo ""
echo "5. Test in MiniPay:"
echo "   Open MiniPay → Developer Settings → Load: proofleger.vercel.app"
echo -e "================================================${NC}"
