import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireCustomer } from "@/lib/auth";
import { orderPath } from "@/lib/orders";
import { formatRupees } from "@/lib/pricing";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

export default async function MyOrdersPage() {
  const customer = await requireCustomer();
  const supabase = await sessionClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, payment_method, status, access_token")
    .eq("customer_id", customer.id)
    .order("id", { ascending: false });
  if (error) throw error;
  const orders = data;

  return (
    <div className="page max-w-4xl py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold text-mor">Hi, {customer.name}</p>
          <h1 className="heading text-5xl md:text-6xl">My orders</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/account/password" className="font-semibold text-muted underline underline-offset-4 hover:text-rani">
            Change password
          </Link>
          <form action={logout}>
            <button type="submit" className="font-semibold text-muted underline underline-offset-4 hover:text-rani">
              Logout
            </button>
          </form>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8">
          <p className="text-lg text-muted">No orders yet.</p>
          <Link href="/products" className="btn-primary mt-5">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={orderPath(order)}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-[var(--radius-soft)] bg-blush px-5 py-4 transition hover:bg-[#fbdfd7]"
              >
                <span className="font-display text-xl font-bold">Order #{order.id}</span>
                <span className="font-semibold">{formatRupees(Number(order.total_amount))}</span>
                <span className="text-sm text-muted">{order.payment_method}</span>
                <span className="text-sm font-semibold text-mor">{order.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
