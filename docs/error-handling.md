# ProofLedger Error Handling

## Error Classification

```javascript
import { classifyError, getUserMessage, isRetryable } from "@/lib/error-handler";

try {
  await anchor(hash, title, type);
} catch(e) {
  const type = classifyError(e);
  const message = getUserMessage(e);
  const canRetry = isRetryable(e);

  notify.error(message);
  if (canRetry) setTimeout(() => retry(), 2000);
}
```

## Error Types

| Type | Cause | Action |
|---|---|---|
| `wallet_not_connected` | No wallet | Prompt connect |
| `user_rejected` | User denied | Show message |
| `insufficient_funds` | Low STX | Show balance |
| `rate_limited` | Too many requests | Auto-retry |
| `already_exists` | Hash on-chain | Show verify link |
| `not_found` | Hash not anchored | Show anchor option |
| `contract_error` | Clarity error | Show details |
| `network_error` | API down | Retry |

## ErrorBoundary Usage

```jsx
import ErrorBoundary from "@/components/ErrorBoundary";

<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <YourComponent />
</ErrorBoundary>
```