"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const ACCENTS = {
  bitcoin: "#F7931A",
  celo:    "#35D07F",
  purple:  "#a78bfa",
  blue:    "#38bdf8",
};

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(ACCENTS.bitcoin);

  return (
    <ThemeContext.Provider value={{ accent, setAccent, ACCENTS }}>
      <style>{`:root { --accent: ${accent}; }`}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);