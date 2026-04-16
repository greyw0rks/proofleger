"use client";
import { useEffect, useRef, useCallback } from "react";

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null || delay === undefined) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

export function useDelayedAction() {
  const timer = useRef(null);
  const run = useCallback((fn, delay) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, delay);
  }, []);
  const cancel = useCallback(() => clearTimeout(timer.current), []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { run, cancel };
}