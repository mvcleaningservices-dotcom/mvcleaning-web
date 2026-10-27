import { createContext, useContext, useState, type ReactNode } from 'react';

export interface HeroBannerConfig {
  heading: string;
  subtext: string;
  buttonText: string;
  badge1: string;
  badge2: string;
  badge3: string;
  badge4: string;
}

const STORAGE_KEY = 'mv_hero_banner';

const DEFAULTS: HeroBannerConfig = {
  heading: 'Sparkling homes, booked in minutes',
  subtext: 'Expert professionals trained to deliver spotless results — every visit, every time.',
  buttonText: 'Explore services',
  badge1: 'Vetted professionals',
  badge2: 'Transparent pricing',
  badge3: 'Professional servicing',
  badge4: 'On time visit',
};

function load(): HeroBannerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULTS;
}

interface HeroBannerCtx {
  config: HeroBannerConfig;
  save: (next: HeroBannerConfig) => void;
}

const Ctx = createContext<HeroBannerCtx | null>(null);

export function HeroBannerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeroBannerConfig>(load);

  const save = (next: HeroBannerConfig) => {
    setConfig(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return <Ctx.Provider value={{ config, save }}>{children}</Ctx.Provider>;
}

export function useHeroBanner(): HeroBannerCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHeroBanner must be inside <HeroBannerProvider>');
  return ctx;
}
