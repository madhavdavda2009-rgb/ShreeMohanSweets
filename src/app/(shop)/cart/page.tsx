"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { OrderTotals } from "@/components/order-totals";
import { useQuote } from "@/components/use-quote";
import { setCartQuantity } from "@/lib/browser-store";
import { formatRupees } from "@/lib/pricing";

export default function CartPage() {
  const { cart, quote } = useQuote();

  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">Your cart</h1>

      {!quote ? (
        <div className="mt-8 grid animate-pulse gap-4" aria-label="Loading cart">
          <div className="h-24 rounded-[var(--radius-soft)] bg-blush" />
          <div className="h-24 rounded-[var(--radius-soft)] bg-blush" />
        </div>
      ) : cart.length === 0 || quote.lines.length === 0 ? (
        <div className="mt-10">
          <p className="text-lg text-muted">Your cart is empty.</p>
          <Link href="/products" className="btn-primary mt-5">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ul className="grid content-start gap-5">
            {quote.lines.map((line) => (
              <li
                key={`${line.productId}-${line.weight}`}
                className="grid grid-cols-[72px_1fr_auto] items-center gap-4 sm:grid-cols-[88px_1fr_auto_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-soft)] bg-blush">
                  {line.imageUrl && <Image src={line.imageUrl} alt="" fill sizes="88px" className="object-cover" />}
                </div>
                <div>
                  <p className="font-display text-lg leading-tight font-bold">{line.name}</p>
                  <p className="text-sm text-muted">
                    {line.weight}, {formatRupees(line.unitPrice)} each
                  </p>
                  {!line.purchasable && <p className="text-sm font-semibold text-rani-deep">Not available right now</p>}
                </div>
                <div className="col-start-2 flex items-center gap-1 sm:col-start-3">
                  <button
                    type="button"
                    aria-label={`Reduce ${line.name}`}
                    onClick={() => setCartQuantity(line.productId, line.weight, line.quantity - 1)}
                    className="grid size-9 place-items-center rounded-lg border border-line hover:border-rani"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${line.name}`}
                    onClick={() => setCartQuantity(line.productId, line.weight, line.quantity + 1)}
                    className="grid size-9 place-items-center rounded-lg border border-line hover:border-rani"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => setCartQuantity(line.productId, line.weight, 0)}
                    className="ml-1 p-2 text-muted hover:text-rani"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
                <p className="col-start-3 row-start-1 font-semibold sm:col-start-4">{formatRupees(line.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-[var(--radius-soft)] bg-blush p-6">
            <OrderTotals quote={quote} />
            <Link href="/checkout" className="btn-primary mt-5 w-full">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
