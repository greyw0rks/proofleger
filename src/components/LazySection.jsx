"use client";
import { useIntersection } from "@/hooks/useIntersection";

export default function LazySection({ children, placeholder = null, rootMargin = "200px" }) {
  const { ref, hasBeenVisible } = useIntersection({ rootMargin });
  return (
    <div ref={ref}>
      {hasBeenVisible ? children : (placeholder || <div style={{ minHeight:100 }} />)}
    </div>
  );
}