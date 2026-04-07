# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in ProofLedger, please report it responsibly.

**Do NOT open a public GitHub issue.**

Email: elchapidave@gmail.com with subject line `[SECURITY] ProofLedger Vulnerability`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will respond within 48 hours and aim to patch critical issues within 7 days.

## Scope

- Smart contracts: `greyw0rks/proofleger-contracts`
- Frontend: `greyw0rks/proofleger`
- SDK: `proofleger-sdk` on npm

## Known Limitations

- Bot wallet keys are stored on the server (gitignored)
- Dashboard password is env-based (not cryptographic auth)
