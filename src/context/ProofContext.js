"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ProofContext = createContext(null);

export function ProofProvider({ children }) {
  const [draft, setDraft] = useState({ hash: null, title: "", docType: "diploma", file: null });
  const [recentProofs, setRecentProofs] = useState([]);

  const updateDraft = useCallback((updates) => {
    setDraft(d => ({ ...d, ...updates }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft({ hash: null, title: "", docType: "diploma", file: null });
  }, []);

  const addRecentProof = useCallback((proof) => {
    setRecentProofs(prev => [proof, ...prev].slice(0, 20));
  }, []);

  return (
    <ProofContext.Provider value={{ draft, updateDraft, clearDraft, recentProofs, addRecentProof }}>
      {children}
    </ProofContext.Provider>
  );
}

export const useProofContext = () => useContext(ProofContext);