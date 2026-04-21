# ProofLedger Component Reference

## Document Components
- `<ProofCard hash title docType blockHeight />` — grid card
- `<CredentialCard hash autoVerify />` — auto-verifies on mount
- `<VerifyResult result hash />` — Stacks verification display
- `<CeloVerifyResult result hash />` — Celo verification display
- `<ProofEmbed hash compact />` — embeddable widget

## Input Components
- `<SearchBar onSearch placeholder />` — debounced search
- `<DocTypeSelector value onChange />` — document type picker
- `<ChainSelector />` — Stacks/Celo toggle with descriptions
- `<NetworkToggle compact />` — compact chain switcher

## Display Components
- `<StatCard label value color sub />` — metric card
- `<Badge label variant dot />` — status badge
- `<ReputationBadge score showScore />` — tier display
- `<MultiChainBadge stacksVerified celoVerified />` — chain status
- `<BlockBadge blockHeight />` — block height tag
- `<DocTypeTag type />` — colored doc type pill
- `<TxStatusBadge txId />` — polls until confirmed

## Layout Components
- `<Navbar address />` — sticky scroll-aware top nav
- `<Footer />` — site footer with block height
- `<Modal open onClose title />` — accessible dialog
- `<Accordion items />` — collapsible FAQ sections
- `<Tooltip text position />` — hover tooltip
- `<Badge label variant />` — status indicator

## Feedback Components
- `<Spinner size color />` — loading indicator
- `<EmptyState title subtitle action />` — empty list placeholder
- `<ToastContainer />` — global notification toasts
- `<ErrorBoundary fallback />` — React error boundary

## Activity Components
- `<ActivityFeed limit />` — Stacks live feed
- `<CeloActivityFeed limit />` — Celo live feed
- `<LeaderboardTable limit />` — ranked wallets
- `<HistoryPanel onReAnchor />` — local IndexedDB history