"use client";
import { useState, useEffect, useCallback } from "react";

export function useKeyPress(targetKey, options = {}) {
  const { onPress, onRelease, element = null } = options;
  const [pressed, setPressed] = useState(false);

  const downHandler = useCallback(({ key }) => {
    if (key === targetKey) {
      setPressed(true);
      onPress?.();
    }
  }, [targetKey, onPress]);

  const upHandler = useCallback(({ key }) => {
    if (key === targetKey) {
      setPressed(false);
      onRelease?.();
    }
  }, [targetKey, onRelease]);

  useEffect(() => {
    const el = element || window;
    el.addEventListener("keydown", downHandler);
    el.addEventListener("keyup", upHandler);
    return () => {
      el.removeEventListener("keydown", downHandler);
      el.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler, element]);

  return pressed;
}