import Link from "next/link";
import { updateOrderStatus } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, orderPath } from "@/lib/orders";
import { formatRupees } from "@/lib/pricing";
import { sessionClient } from "@/lib/supabase/server";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(id, quantity, weight, products(name))")
    .order("id", { ascending: false })
    .limit(200);
  if (error) throw error;

  return (
    <>
      <h1 className="heading text-4xl">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-muted">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="table-admin min-w-[820px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={orderPath(order, "invoice")} target="_blank" className="font-semibold text-rani underline">
                      #{order.id}
                    </Link>
                  </td>
                  <td>
                    <span className="block font-medium">{order.customer_name}</span>
                    <a href={`tel:${order.phone}`} className="text-muted">
                      {order.phone}
                    </a>
                    <span className="block max-w-56 text-xs text-muted">{order.address}</span>
                  </td>
                  <td>
                    {order.order_items.map((item) => (
                      <span key={item.id} className="block">
                        {item.products.name}
                        {item.weight ? `, ${item.weight}` : ""} x {item.quantity}
                      </span>
                    ))}
                  </td>
                  <td>
                    {formatRupees(Number(order.total_amount))}
                    <span className="block text-xs text-muted">{order.payment_method}</span>
                  </td>
                  <td>
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select name="status" defaultValue={order.status} aria-label={`Status of order ${order.id}`} className="input w-32 px-2 py-1.5">
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Delivered</option>
                      </select>
                      <button type="submit" className="font-semibold text-rani underline">
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="whitespace-nowrap">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
