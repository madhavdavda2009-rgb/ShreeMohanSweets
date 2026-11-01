// Single source of truth for money. Imported by client UI and by the checkout action.

export const WEIGHTS = ["250g", "500g", "1kg"] as const;
export type Weight = (typeof WEIGHTS)[number];

// products.price is per kg, matching the kilo rates on the shop's own price boards.
// The PHP cart instead treated it as a 250g price (a 1kg box of ₹800 kaju katli came
// to ₹3200) and its checkout ignored weight entirely. To change the basis, edit this.
const WEIGHT_MULTIPLIER: Record<Weight, number> = { "250g": 0.25, "500g": 0.5, "1kg": 1 };

export const FREE_DELIVERY_FROM = 1000;
export const DELIVERY_CHARGE = 40;

export function isWeight(value: unknown): value is Weight {
  return WEIGHTS.includes(value as Weight);
}

export function priceForWeight(pricePerKg: number, weight: Weight) {
  return Math.round(pricePerKg * WEIGHT_MULTIPLIER[weight] * 100) / 100;
}

export function deliveryCharge(subtotal: number) {
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_CHARGE;
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
