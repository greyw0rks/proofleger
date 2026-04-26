"use client";
import { useState, useEffect } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let timer = null;
    function update() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    }
    update();
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); clearTimeout(timer); };
  }, []);

  return size;
}