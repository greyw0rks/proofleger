"use client";
import { useRef, useState, useEffect } from "react";

export function useIntersection(options = {}) {
  const ref             = useRef(null);
  const [isVisible, setIsVisible]     = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) setHasBeenVisible(true);
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isVisible, hasBeenVisible };
}