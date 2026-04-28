# ProofLedger User Guide

## Anchoring a Document

### Step 1 — Connect Your Wallet

Click **CONNECT WALLET** in the top navigation. ProofLedger supports
Leather (formerly Hiro Wallet) and Xverse for Stacks, or any EVM wallet
for Celo.

### Step 2 — Select a File

On the **Anchor** page, drop your file into the upload zone or click to browse.
Your file is hashed client-side using SHA-256 — the file itself never leaves
your device.

### Step 3 — Add Details

Enter a document title (max 100 characters) and select the document type:
Diploma, Certificate, Research, Contribution, Award, Art, or Other.

### Step 4 — Choose a Chain

Select **Stacks** (Bitcoin-secured, ~10 min finality) or **Celo**
(EVM-compatible, ~5 sec finality).

### Step 5 — Anchor

Review the confirmation screen and click **ANCHOR DOCUMENT**. Approve the
transaction in your wallet. Once confirmed, your document hash is permanently
recorded on-chain.

## Verifying a Document

### By File

Drop the file into the **Verify** page. The app re-hashes it client-side
and checks both Stacks and Celo simultaneously.

### By Hash

Paste a 64-character hex SHA-256 hash directly into the verify input.

### Result

A green **VERIFIED** card means the hash exists on-chain with the original
title, issuer, block height, and timestamp. A grey **NOT FOUND** means the
hash has not been anchored.

## Sharing a Proof

After verifying, click **↗ SHARE PROOF** to copy a shareable verification
URL that anyone can use to independently confirm the document.

## Your Profile

The **Profile** page shows your proof history, reputation score,
active stake, and earned achievement badges.