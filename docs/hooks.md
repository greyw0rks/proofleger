# ProofLedger Custom Hooks Reference

## Blockchain Hooks

### `useAnchor()`
Anchor a document to Stacks. Returns `{ anchor, loading, txId, error, step }`.

### `useAttest()`
Attest to a document hash on Stacks. Returns `{ attest, loading, txId, error }`.

### `useVerify()`
Read-only hash lookup with IndexedDB cache and 429 retry.
Returns `{ verify, result, loading, error, exists }`.

### `useCeloAnchor()` / `useCeloVerify()`
Celo equivalents using viem. Same return shape as Stacks hooks.

### `useTxHistory(limit)`
Fetches recent transactions from Hiro API for the connected wallet.
Returns `{ txs, loading, error, refresh }`.

## File Hooks

### `useHash()`
Client-side SHA-256 with chunked large-file support.
Returns `{ hash, hashing, progress, fileName, fileSize, hashFile, hashText, reset }`.

## State Hooks

### `useProofHistory(pageSize)`
Paginated local proof submission log (localStorage-backed).
Returns `{ history, total, page, totalPages, nextPage, prevPage, add, remove, clear, hydrated }`.

### `useLocalStorage(key, initialValue)`
SSR-safe localStorage hook. Returns `[value, setValue, { hydrated, removeValue }]`.

### `useClipboard(resetMs)`
Copy with animated confirmation. Returns `{ copy, copied }`.

### `usePrevious(value)`
Returns the value from the previous render.

### `useDebounce(value, delay)`
Returns a debounced value after `delay` ms.

## UI Hooks

### `useWindowSize()`
Reactive window dimensions. Returns `{ width, height }`.

### `useMediaQuery(query)` / `useIsMobile()` / `useIsTablet()` / `useIsDesktop()`
CSS media query bindings.

### `useIntersection(options)`
IntersectionObserver wrapper. Returns `{ ref, isVisible, hasBeenVisible }`.

### `useOnClickOutside(ref, handler)`
Fires handler on mousedown/touchstart outside the ref element.

### `useKeyPress(key, options)`
Global or element-scoped keyboard shortcut listener. Returns `pressed: bool`.

### `usePolling(fn, intervalMs, options)`
Interval-based polling, pauses on tab blur. Returns `{ start, stop }`.

## Context Hooks

### `useNetworkContext()`
Access and set the active chain. Returns `{ network, setNetwork, networks }`.

### `useNetworkSwitch()`
Convenience wrapper with toast feedback. Returns `{ network, switchTo, toggle, networks }`.

### `useWalletContext()`
Connected wallet state. Returns `{ address, isConnected, connect, disconnect }`.