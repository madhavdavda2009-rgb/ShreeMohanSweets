"use client";

import { useEffect, useState } from "react";
import { quoteCart } from "@/app/actions/shop";
import { useCart } from "@/lib/browser-store";
import type { Quote } from "@/lib/quote";

export function useQuote() {
  const cart = useCart();
  const [quote, setQuote] = useState<Quote | null>(null);
  const key = JSON.stringify(cart);

  useEffect(() => {
    let current = true;
    quoteCart(JSON.parse(key)).then((result) => {
      if (current) setQuote(result);
    });
    return () => {
      current = false;
    };
  }, [key]);

  return { cart, quote };
}
