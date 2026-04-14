# Advanced React Hooks

## Search and Filter

```javascript
import { useSearch } from "@/hooks/useSearch";

const { query, setQuery, filters, setFilter, results } = useSearch(
  documents,
  ["title", "docType"]
);
```

## Notifications

```javascript
import { notify } from "@/lib/notifications";

notify.success("Document anchored to Bitcoin!");
notify.error("Transaction failed");
```

## Profile

```javascript
import { useProfile } from "@/hooks/useProfile";

const { profile, loading } = useProfile("SP1SY1...");
// profile.anchors, profile.reputation, profile.nfts
```

## Performance

```javascript
import { useIntersection } from "@/hooks/useIntersection";

const [ref, isVisible] = useIntersection();
// Lazy-load content when element enters viewport
```