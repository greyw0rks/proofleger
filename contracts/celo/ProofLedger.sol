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
