"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Convenience wrappers for standard breakpoints
export function useIsMobile()  { return useMediaQuery("(max-width: 639px)"); }
export function useIsTablet()  { return useMediaQuery("(max-width: 1023px)"); }
export function useIsDesktop() { return useMediaQuery("(min-width: 1024px)"); }
export function useIsDark()    { return useMediaQuery("(prefers-color-scheme: dark)"); }