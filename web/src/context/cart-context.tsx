"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  boxId: string;
  slug: string;
  name: string;
  priceEur: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addBox: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (boxId: string, quantity: number) => void;
  removeLine: (boxId: string) => void;
  clear: () => void;
  totalItems: number;
  subtotalEur: number;
};

const STORAGE_KEY = "sodo-sidrine-cart-v2";

const CartContext = createContext<CartContextValue | null>(null);

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addBox = useCallback(
    (item: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.boxId === item.boxId);
        if (idx === -1) {
          return [...prev, { ...item, quantity }];
        }
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity,
        };
        return next;
      });
    },
    [],
  );

  const setQuantity = useCallback((boxId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((l) => l.boxId !== boxId);
      }
      return prev.map((l) => (l.boxId === boxId ? { ...l, quantity } : l));
    });
  }, []);

  const removeLine = useCallback((boxId: string) => {
    setLines((prev) => prev.filter((l) => l.boxId !== boxId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotalEur = lines.reduce((s, l) => s + l.priceEur * l.quantity, 0);
    return {
      lines,
      addBox,
      setQuantity,
      removeLine,
      clear,
      totalItems,
      subtotalEur,
    };
  }, [lines, addBox, setQuantity, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
