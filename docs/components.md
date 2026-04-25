# ProofLedger Component Reference

## Core Components

### `<FileDropZone onHash={fn} onFile={fn} />`
Drag-and-drop file upload with client-side SHA-256 hashing and progress bar.
Large files (>5MB) are hashed in 2MB chunks.

### `<AnchorForm />`
Full document anchoring form. Includes `<ChainSelector>`, `<FileDropZone>`, title input,
doc type selector, and submit button. Reads network from `NetworkContext`.

### `<VerifyForm />`
Multi-chain verify — hash paste or file-drop. Runs Stacks and Celo checks in parallel.

### `<TxHistory limit={20} />`
Paginated transaction list for the connected wallet. Shows status, tx link, and block height.

## Display

### `<HashDisplay hash={str} label={str} showCopy />`
Truncated hash with copy button and click-to-expand.

### `<NetworkBadge compact />`
Live network indicator — shows chain name with color-coded status dot.

### `<DocTypeTag type="diploma" />`
Colored pill tag for document type.

### `<BlockBadge blockHeight={n} />`
Bitcoin block height with Hiro Explorer link.

### `<TxLink txId={str} network="stacks|celo" shorten />`
Transaction hash link to Hiro Explorer or CeloScan.

### `<StatCard label value color sub />`
Metric display card.

## Feedback

### `<CopyButton text label copiedLabel size="sm|lg" />`
Copy-to-clipboard with animated confirmation.

### `<Spinner size color />`
Inline loading spinner.

### `<ProgressSteps steps={[]} current={n} />`
Horizontal step indicator for multi-step flows.

### `<AlertBanner type="info|warning|error|success" message dismissible />`
Dismissible notification banner.

### `<Tooltip content placement="top|bottom|left|right" />`
Lightweight hover tooltip wrapper.

## Layout

### `<EmptyState title subtitle action onAction />`
Empty list placeholder with optional action button.

### `<LazySection rootMargin="200px" />`
Renders children only when scrolled into view.