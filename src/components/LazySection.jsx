"use client";
import { useIntersection } from "@/hooks/useIntersection";

export default function LazySection({ children, rootMargin = "200px", fallback = null }) {
  const { ref, hasBeenVisible } = useIntersection({ rootMargin });
  return (
    <div ref={ref}>
      {hasBeenVisible ? children : fallback}
    </div>
  );
}