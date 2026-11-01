import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatRupees } from "@/lib/pricing";
import { sessionClient } from "@/lib/supabase/server";

type Stats = { products: number; unpriced: number; orders: number; pending: number; revenue: number };

export default async function DashboardPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const [statsResult, lowStockResult] = await Promise.all([
    supabase.rpc("dashboard_stats"),
    supabase.from("products").select("id, name, stock_quantity").lte("stock_quantity", 5).order("stock_quantity").limit(12),
  ]);
  if (statsResult.error) throw statsResult.error;
  if (lowStockResult.error) throw lowStockResult.error;
  const stats = statsResult.data as unknown as Stats;
  const lowStock = lowStockResult.data;

  const cards = [
    { label: "Products", value: stats.products, href: "/admin/products" },
    { label: "Orders", value: stats.orders, href: "/admin/orders" },
    { label: "Pending orders", value: stats.pending, href: "/admin/orders" },
    { label: "Revenue", value: formatRupees(Number(stats.revenue)), href: "/admin/payments" },
  ];

  return (
    <>
      <h1 className="heading text-4xl">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-[var(--radius-soft)] bg-blush p-5">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="font-display text-3xl font-extrabold">{card.value}</p>
          </Link>
        ))}
      </div>

      {stats.unpriced > 0 && (
        <p className="notice-error mt-6">
          {stats.unpriced} products have no price and show &quot;Ask price on WhatsApp&quot;.{" "}
          <Link href="/admin/products" className="underline">
            Set prices
          </Link>
        </p>
      )}

      <h2 className="heading mt-10 text-2xl">Low stock</h2>
      {lowStock.length === 0 ? (
        <p className="mt-2 text-muted">All products are well stocked.</p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {lowStock.map((product) => (
            <li key={product.id}>
              <Link href={`/admin/products/${product.id}`} className="hover:text-rani">
                {product.name}: {product.stock_quantity} left
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
