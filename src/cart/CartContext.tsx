import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ServiceItem } from '../api';

/**
 * The booking cart (selected services), persisted to localStorage so a refresh
 * or navigating to /checkout doesn't lose the selection. Scoped to the app zone.
 */
const KEY = 'mv_cart';

function loadCart(): Record<string, ServiceItem> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

interface CartState {
  items: ServiceItem[];
  count: number;
  total: number;
  has: (id: string) => boolean;
  toggle: (service: ServiceItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, ServiceItem>>(loadCart);

  const persist = (next: Record<string, ServiceItem>) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  };

  const toggle = useCallback((service: ServiceItem) => {
    setMap((prev) => {
      const next = { ...prev };
      if (next[service.id]) delete next[service.id];
      else next[service.id] = service;
      return persist(next);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return persist(next);
    });
  }, []);

  const clear = useCallback(() => setMap(persist({})), []);

  const items = useMemo(() => Object.values(map), [map]);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

  const value: CartState = {
    items,
    count: items.length,
    total,
    has: (id) => !!map[id],
    toggle,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
