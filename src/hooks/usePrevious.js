"use client";
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

export function useChanged(value) {
  const prev = usePrevious(value);
  return { prev, changed: prev !== value };
}