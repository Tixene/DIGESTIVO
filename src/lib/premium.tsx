import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface PremiumContextValue {
  isPremium: boolean;
  setIsPremium: (v: boolean) => void;
  showPaywall: () => void;
  paywallOpen: boolean;
  setPaywallOpen: (v: boolean) => void;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

const STORAGE_KEY = 'gutlog_premium';

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremiumState] = useState<boolean>(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setIsPremiumState(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setIsPremium = (v: boolean) => {
    setIsPremiumState(v);
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {
      /* ignore */
    }
  };

  const showPaywall = () => setPaywallOpen(true);

  return (
    <PremiumContext.Provider value={{ isPremium, setIsPremium, showPaywall, paywallOpen, setPaywallOpen }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider');
  return ctx;
}
