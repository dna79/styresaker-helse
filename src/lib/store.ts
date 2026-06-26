"use client";

import { useState, useEffect, useCallback } from "react";
import { Kapabilitet, Produktkapabilitet, DigitaltProdukt } from "./types";
import { SEED_DATA } from "./seedData";
import { PRODUKTKAPABILITETER, DIGITALE_PRODUKTER } from "./data";

const STORAGE_KEY = "sp-kapabilitetsplan-v2";
const PRODUKT_KEY = "sp-produktkapabiliteter-v1";
const DIGITALT_KEY = "sp-digitale-produkter-v1";

export function useKapabilitetStore() {
  const [kapabiliteter, setKapabiliteter] = useState<Kapabilitet[]>(() => {
    if (typeof window === "undefined") return SEED_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return SEED_DATA;
      const parsed: Kapabilitet[] = JSON.parse(stored);
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

  const [produktkapabiliteter, setProduktkapabiliteter] = useState<Produktkapabilitet[]>(() => {
    if (typeof window === "undefined") return PRODUKTKAPABILITETER;
    try {
      const stored = localStorage.getItem(PRODUKT_KEY);
      if (!stored) return PRODUKTKAPABILITETER;
      const parsed: Produktkapabilitet[] = JSON.parse(stored);
      const storedIds = new Set(parsed.map((k) => k.id));
      return [
        ...parsed,
        ...PRODUKTKAPABILITETER.filter((k) => !storedIds.has(k.id)),
      ];
    } catch {
      return PRODUKTKAPABILITETER;
    }
  });

  const [digitaleProdukter, setDigitaleProdukter] = useState<DigitaltProdukt[]>(() => {
    if (typeof window === "undefined") return DIGITALE_PRODUKTER;
    try {
      const stored = localStorage.getItem(DIGITALT_KEY);
      if (!stored) return DIGITALE_PRODUKTER;
      const parsed: DigitaltProdukt[] = JSON.parse(stored);
      const storedIds = new Set(parsed.map((d) => d.id));
      return [
        ...parsed,
        ...DIGITALE_PRODUKTER.filter((d) => !storedIds.has(d.id)),
      ];
    } catch {
      return DIGITALE_PRODUKTER;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(kapabiliteter)); } catch { /* ignore */ }
  }, [kapabiliteter]);

  useEffect(() => {
    try { localStorage.setItem(PRODUKT_KEY, JSON.stringify(produktkapabiliteter)); } catch { /* ignore */ }
  }, [produktkapabiliteter]);

  useEffect(() => {
    try { localStorage.setItem(DIGITALT_KEY, JSON.stringify(digitaleProdukter)); } catch { /* ignore */ }
  }, [digitaleProdukter]);

  const updateKapabilitet = useCallback((id: string, updates: Partial<Kapabilitet>) => {
    setKapabiliteter((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  }, []);

  const updateProduktkapabilitet = useCallback((id: string, updates: Partial<Produktkapabilitet>) => {
    setProduktkapabiliteter((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  }, []);

  const updateDigitaltProdukt = useCallback((id: string, updates: Partial<DigitaltProdukt>) => {
    setDigitaleProdukter((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const resetToSeed = useCallback(() => {
    setKapabiliteter(SEED_DATA);
    setProduktkapabiliteter(PRODUKTKAPABILITETER);
    setDigitaleProdukter(DIGITALE_PRODUKTER);
  }, []);

  return {
    kapabiliteter, updateKapabilitet,
    produktkapabiliteter, updateProduktkapabilitet,
    digitaleProdukter, updateDigitaltProdukt,
    resetToSeed,
  };
}
