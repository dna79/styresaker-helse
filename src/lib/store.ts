"use client";

import { useState, useEffect, useCallback } from "react";
import { Kapabilitet } from "./types";
import { SEED_DATA } from "./seedData";

const STORAGE_KEY = "sykehuspartner-kapabiliteter";

export function useKapabilitetStore() {
  const [kapabiliteter, setKapabiliteter] = useState<Kapabilitet[]>(() => {
    if (typeof window === "undefined") return SEED_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_DATA;
    } catch {
      return SEED_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kapabiliteter));
  }, [kapabiliteter]);

  const updateKapabilitet = useCallback((id: string, updates: Partial<Kapabilitet>) => {
    setKapabiliteter((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates } : k))
    );
  }, []);

  const resetToSeed = useCallback(() => {
    setKapabiliteter(SEED_DATA);
  }, []);

  return { kapabiliteter, updateKapabilitet, resetToSeed };
}
