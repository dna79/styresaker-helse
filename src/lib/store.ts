"use client";

import { useState, useEffect, useCallback } from "react";
import { Kapabilitet } from "./types";
import { SEED_DATA } from "./seedData";

const STORAGE_KEY = "sp-kapabilitetsplan-v2";

export function useKapabilitetStore() {
  const [kapabiliteter, setKapabiliteter] = useState<Kapabilitet[]>(() => {
    if (typeof window === "undefined") return SEED_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return SEED_DATA;
      const parsed: Kapabilitet[] = JSON.parse(stored);
      // Merge: keep user scores but add any new seed entries
      const storedIds = new Set(parsed.map((k) => k.id));
      const merged = [
        ...parsed,
        ...SEED_DATA.filter((k) => !storedIds.has(k.id)),
      ];
      return merged;
    } catch {
      return SEED_DATA;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kapabiliteter));
    } catch {
      // quota exceeded - ignore
    }
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
