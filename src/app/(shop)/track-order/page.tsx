"use client";

import Link from "next/link";
import { useActionState } from "react";
import { trackOrder } from "@/app/actions/shop";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";
import { formatRupees } from "@/lib/pricing";

export default function TrackOrderPage() {
  const [state, action] = useActionState(trackOrder, {});
  return (
    <div className="page max-w-2xl py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">Track your order</h1>
      <p className="mt-3 text-lg text-muted">Enter your order number and phone number to check status.</p>

      <ActionForm action={action} className="mt-8 grid gap-5">
        <FormNotice error={state.error} />
        <div className="field">
          <label htmlFor="orderId">Order number</label>
          <input id="orderId" name="orderId" type="number" min={1} required className="input" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required className="input" />
        </div>
        <SubmitButton className="btn-primary justify-self-start">Track Order</SubmitButton>
      </ActionForm>

      {state.order && (
        <section className="mt-8 rounded-[var(--radius-soft)] bg-blush p-6">
          <h2 className="font-display text-2xl font-bold">Order #{state.order.id}</h2>
          <p className="mt-2">
            Status: <strong className="text-mor">{state.order.status}</strong>
          </p>
          <p>Total: {formatRupees(state.order.total)}</p>
          <p>Placed on: {state.order.date}</p>
          <Link href={state.order.link} className="btn-secondary mt-4">
            View Order
          </Link>
        </section>
      )}
    </div>
  );
}
