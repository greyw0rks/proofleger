"use client";
import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    let lastY = window.scrollY;
    function update() {
      const y = window.scrollY;
      setDirection(y > lastY ? "down" : "up");
      setPosition({ x: window.scrollX, y });
      lastY = y;
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return { ...position, direction, isScrolled: position.y > 50 };
}