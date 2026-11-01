"use client";

import { useSyncExternalStore } from "react";
import { isWeight, type Weight } from "./pricing";

// Cart and wishlist live in the visitor's browser. Prices are never stored here;
// the server prices every line from the database when the cart is shown and at checkout.
export type CartLine = { productId: number; weight: Weight; quantity: number };

const CART_KEY = "smsn-cart";
const WISHLIST_KEY = "smsn-wishlist";

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown[] }>();
const EMPTY: never[] = [];

function readList<T>(key: string): T[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return EMPTY;
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T[];
  let value: unknown[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed;
  } catch {
    value = [];
  }
  cache.set(key, { raw, value });
  return value as T[];
}

function writeList(key: string, value: unknown[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode); the page keeps working without persistence.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function validLines(lines: CartLine[]) {
  return lines.filter(
    (line) => Number.isInteger(line?.productId) && isWeight(line?.weight) && line?.quantity > 0,
  );
}

export function useCart() {
  const raw = useSyncExternalStore(
    subscribe,
    () => readList<CartLine>(CART_KEY),
    () => EMPTY,
  );
  return validLines(raw);
}

export function useCartCount() {
  return useCart().reduce((sum, line) => sum + line.quantity, 0);
}

export function addToCart(productId: number, weight: Weight, quantity = 1) {
  const lines = validLines(readList<CartLine>(CART_KEY));
  const existing = lines.find((l) => l.productId === productId && l.weight === weight);
  writeList(
    CART_KEY,
    existing
      ? lines.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l))
      : [...lines, { productId, weight, quantity }],
  );
}

export function setCartQuantity(productId: number, weight: Weight, quantity: number) {
  const lines = validLines(readList<CartLine>(CART_KEY));
  writeList(
    CART_KEY,
    lines
      .map((l) => (l.productId === productId && l.weight === weight ? { ...l, quantity } : l))
      .filter((l) => l.quantity > 0),
  );
}

export function clearCart() {
  writeList(CART_KEY, []);
}

export function useWishlist() {
  return useSyncExternalStore(
    subscribe,
    () => readList<number>(WISHLIST_KEY),
    () => EMPTY as number[],
  );
}

export function toggleWishlist(productId: number) {
  const ids = readList<number>(WISHLIST_KEY);
  writeList(
    WISHLIST_KEY,
    ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
  );
}
