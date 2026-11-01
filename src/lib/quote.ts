import "server-only";
import { getProductsByIds } from "./catalog";
import { deliveryCharge, isWeight, priceForWeight, type Weight } from "./pricing";

export type QuoteInput = { productId: number; weight: Weight; quantity: number };

export type QuoteLine = QuoteInput & {
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  lineTotal: number;
  purchasable: boolean;
};

export type Quote = { lines: QuoteLine[]; subtotal: number; delivery: number; total: number };

const MAX_QUANTITY = 50;

// Lines come from the browser, so everything about them is checked here and every
// price is taken from the database.
export async function buildQuote(input: unknown): Promise<Quote> {
  const requested = (Array.isArray(input) ? input : []).filter(
    (line): line is QuoteInput =>
      Number.isInteger(line?.productId) &&
      isWeight(line?.weight) &&
      Number.isInteger(line?.quantity) &&
      line.quantity > 0 &&
      line.quantity <= MAX_QUANTITY,
  );

  const products = await getProductsByIds([...new Set(requested.map((line) => line.productId))]);
  const byId = new Map(products.map((product) => [product.id, product]));

  const lines = requested.flatMap((line) => {
    const product = byId.get(line.productId);
    if (!product) return [];
    const unitPrice = priceForWeight(product.price, line.weight);
    return [
      {
        ...line,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice,
        lineTotal: unitPrice * line.quantity,
        purchasable: product.available && product.price > 0,
      },
    ];
  });

  const subtotal = lines.reduce((sum, line) => sum + (line.purchasable ? line.lineTotal : 0), 0);
  const delivery = subtotal > 0 ? deliveryCharge(subtotal) : 0;
  return { lines, subtotal, delivery, total: subtotal + delivery };
}
