"use client";
import { useState, useEffect, useRef } from "react";

export function useIntersection(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) setHasBeenVisible(true);
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, isVisible, hasBeenVisible };
}