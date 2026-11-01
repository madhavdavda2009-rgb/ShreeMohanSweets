"use client";

import { ShoppingBagIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useCartCount } from "@/lib/browser-store";

export function CartLink() {
  const count = useCartCount();
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} data-cart-link className="relative p-2.5 hover:text-rani">
      <ShoppingBagIcon size={24} />
      {count > 0 && (
        <span key={count} className="badge-pop absolute top-0.5 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-rani px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
