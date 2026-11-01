"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { placeOrder } from "@/app/actions/shop";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";
import { OrderTotals } from "@/components/order-totals";
import { useQuote } from "@/components/use-quote";
import { clearCart } from "@/lib/browser-store";
import { formatRupees } from "@/lib/pricing";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, quote } = useQuote();
  const [state, action] = useActionState(placeOrder, {});

  useEffect(() => {
    if (!state.redirectTo) return;
    router.replace(state.redirectTo);
    clearCart();
  }, [state.redirectTo, router]);

  if (state.redirectTo) return <p className="page py-14 text-muted">Opening your order...</p>;

  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">Checkout</h1>

      {quote && quote.lines.length === 0 ? (
        <div className="mt-10">
          <p className="text-lg text-muted">Your cart is empty.</p>
          <Link href="/products" className="btn-primary mt-5">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ActionForm action={action} className="grid content-start gap-5">
            <input type="hidden" name="lines" value={JSON.stringify(cart)} />
            <FormNotice error={state.error} />
            <div className="field">
              <label htmlFor="customerName">Full name</label>
              <input id="customerName" name="customerName" required autoComplete="name" className="input" />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                autoComplete="tel-national"
                className="input"
              />
              <p className="text-sm text-muted">10 digits. We confirm orders on this number.</p>
            </div>
            <div className="field">
              <label htmlFor="address">Delivery address</label>
              <textarea id="address" name="address" rows={4} required autoComplete="street-address" className="input" />
            </div>
            <fieldset className="field">
              <legend className="label mb-2">Payment method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {["UPI", "Cash on Delivery"].map((method, index) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-soft)] border border-[#cdb0a8] bg-white px-4 py-3 has-checked:border-rani"
                  >
                    <input type="radio" name="paymentMethod" value={method} defaultChecked={index === 0} className="accent-rani" />
                    {method}
                  </label>
                ))}
              </div>
            </fieldset>
            <SubmitButton className="btn-primary w-full sm:w-auto sm:justify-self-start">Place Order</SubmitButton>
          </ActionForm>

          <aside className="h-fit rounded-[var(--radius-soft)] bg-blush p-6">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            {!quote ? (
              <div className="mt-4 h-32 animate-pulse rounded-lg bg-white/60" />
            ) : (
              <>
                <ul className="my-4 grid gap-2 text-sm">
                  {quote.lines.map((line) => (
                    <li key={`${line.productId}-${line.weight}`} className="flex justify-between gap-3">
                      <span>
                        {line.name}, {line.weight} x {line.quantity}
                      </span>
                      <span className="font-medium">{formatRupees(line.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <OrderTotals quote={quote} />
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
