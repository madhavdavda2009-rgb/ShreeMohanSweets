"use client";

import { site } from "@/lib/site";

export default function ShopError({ reset }: { reset: () => void }) {
  return (
    <div className="page py-20">
      <h1 className="heading text-5xl">Something went wrong</h1>
      <p className="mt-3 text-lg text-muted">Please try again, or call us on {site.phone} to place your order.</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try Again
      </button>
    </div>
  );
}
