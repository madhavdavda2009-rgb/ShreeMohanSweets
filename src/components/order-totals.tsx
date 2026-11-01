import { formatRupees, FREE_DELIVERY_FROM } from "@/lib/pricing";
import type { Quote } from "@/lib/quote";

export function OrderTotals({ quote }: { quote: Quote }) {
  return (
    <dl className="grid gap-2">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatRupees(quote.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Delivery</dt>
        <dd>{quote.delivery === 0 ? <span className="font-semibold text-mor">Free</span> : formatRupees(quote.delivery)}</dd>
      </div>
      <div className="mt-1 flex justify-between border-t border-line pt-3 font-display text-2xl font-extrabold">
        <dt>Total</dt>
        <dd>{formatRupees(quote.total)}</dd>
      </div>
      {quote.delivery > 0 && (
        <p className="text-sm text-muted">
          Add {formatRupees(FREE_DELIVERY_FROM - quote.subtotal)} more for free delivery within 3 km.
        </p>
      )}
    </dl>
  );
}
