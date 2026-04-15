"use client";
import { useEffect, useCallback } from "react";

export function useKeyboard(shortcuts) {
  const handle = useCallback((e) => {
    const key = [
      e.ctrlKey && "ctrl",
      e.metaKey && "meta",
      e.shiftKey && "shift",
      e.altKey && "alt",
      e.key.toLowerCase(),
    ].filter(Boolean).join("+");
    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key](e);
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handle]);
}