"use client";

import { useActionState } from "react";
import { createOffer, createReview } from "@/app/actions/admin";
import { FormNotice, SubmitButton } from "./forms";

export function OfferForm({ today }: { today: string }) {
  const [state, action] = useActionState(createOffer, {});
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-5">
      <FormNotice error={state.error} success={state.success} />
      <div className="field">
        <label htmlFor="description">Offer text</label>
        <input id="description" name="description" required maxLength={255} className="input" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="field">
          <label htmlFor="discount">Discount (%)</label>
          <input id="discount" name="discount" type="number" min={0} max={100} step="0.01" defaultValue={0} className="input" />
        </div>
        <div className="field">
          <label htmlFor="startDate">Start date</label>
          <input id="startDate" name="startDate" type="date" required defaultValue={today} className="input" />
        </div>
        <div className="field">
          <label htmlFor="endDate">End date</label>
          <input id="endDate" name="endDate" type="date" required defaultValue={today} className="input" />
        </div>
      </div>
      <SubmitButton className="btn-primary justify-self-start">Add Offer</SubmitButton>
    </form>
  );
}

export function ReviewForm() {
  const [state, action] = useActionState(createReview, {});
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-5">
      <FormNotice error={state.error} success={state.success} />
      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <div className="field">
          <label htmlFor="customerName">Customer name</label>
          <input id="customerName" name="customerName" required className="input" />
        </div>
        <div className="field">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" defaultValue="5" className="input">
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="reviewText">Review</label>
        <textarea id="reviewText" name="reviewText" rows={3} required className="input" />
      </div>
      <SubmitButton className="btn-primary justify-self-start">Add Review</SubmitButton>
    </form>
  );
}
