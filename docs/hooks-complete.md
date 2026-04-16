# Complete Hooks Reference

## Wallet
- `useWalletContext()` — global wallet state
- `useMiniPaySession()` — MiniPay auto-connect
- `useCeloBalance(addr)` — CELO balance
- `useCeloDocCount(addr)` — Celo document count
- `useCeloGas()` — gas price estimation

## Documents
- `useAnchor()` — anchor to Stacks
- `useVerify()` — verify on Stacks
- `useAttest()` — attest document
- `useHash()` — SHA-256 hash
- `useCeloAnchor()` — anchor to Celo
- `useCeloVerify()` — verify on Celo
- `useContractCall(fn)` — generic read-only call
- `useMultiChain(network)` — unified multi-chain
- `useProfile(address)` — complete profile
- `useRecords(address)` — transaction history
- `useTransactionStatus(txId)` — TX polling

## UI
- `useSearch(items, keys)` — client-side search
- `usePagination(items, pageSize)` — pagination
- `useForm(values, validators)` — form state
- `useClipboard(timeout)` — copy to clipboard
- `useNotifications()` — notification queue
- `useReputation()` — score calculation

## Utilities
- `useDebounce(value, delay)` — debounce
- `useLocalStorage(key, init)` — persisted state
- `useNetwork()` — Stacks block height
- `useMediaQuery(query)` — CSS media query
- `useIsMobile()` — mobile breakpoint
- `useScrollPosition()` — scroll tracking
- `useIntersection()` — visibility detection
- `useWindowSize()` — window dimensions
- `useKeyboard(shortcuts)` — keyboard shortcuts
- `useFocus()` — focus state
- `usePrevious(value)` — previous value
- `useInterval(fn, delay)` — safe interval
- `useTimeout(fn, delay)` — safe timeout
- `useCeloEvents()` — Celo event listener