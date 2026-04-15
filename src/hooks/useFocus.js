"use client";
import { useState, useCallback, useRef } from "react";

export function useFocus() {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);
  return { ref, focused, onFocus, onBlur };
}