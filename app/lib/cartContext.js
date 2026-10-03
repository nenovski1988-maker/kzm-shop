'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'kzm_cart_v1';

function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Зарежда от localStorage само на клиента (след mount), за да не предизвика
  // несъответствие между server-rendered и client-rendered markup.
  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage недостъпен (private mode и т.н.) — количката просто няма да се запази между зареждания
    }
  }, [items, loaded]);

  // stockQty се пази в количката като "снимка" на наличността в момента на
  // добавяне — ползва се само за да ограничи +/- бутоните в UI-то. Реалната
  // проверка винаги е сървърна (create_order), така че дори тази снимка да
  // е остаряла (друг клиент е купил междувременно), нищо не може да се
  // пренаръча свръх реалната наличност.
  function addItem(product, qty = 1) {
    const stockQty = product.stock_qty ?? Infinity;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: Math.min(stockQty, i.qty + qty), stockQty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] ?? null,
          priceCents: product.price_cents,
          qty: Math.min(stockQty, qty),
          stockQty,
        },
      ];
    });
  }

  function updateQty(productId, qty) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId
              ? { ...i, qty: Math.min(qty, i.stockQty ?? Infinity) }
              : i
          )
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.priceCents, 0),
    [items]
  );

  const value = { items, loaded, addItem, updateQty, removeItem, clearCart, totalCount, totalCents };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart трябва да се ползва вътре в <CartProvider>.');
  return ctx;
}
