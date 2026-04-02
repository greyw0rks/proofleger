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
