import { togglePayment } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/orders";
import { formatRupees } from "@/lib/pricing";
import { sessionClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: payments, error } = await supabase
    .from("payments")
    .select("id, order_id, amount, method, status, created_at, orders(customer_name)")
    .order("id", { ascending: false })
    .limit(200);
  if (error) throw error;

  return (
    <>
      <h1 className="heading text-4xl">Payments</h1>
      {payments.length === 0 ? (
        <p className="mt-4 text-muted">No payments yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="table-admin min-w-[640px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>#{payment.order_id}</td>
                  <td>{payment.orders.customer_name}</td>
                  <td>{formatRupees(Number(payment.amount))}</td>
                  <td>{payment.method}</td>
                  <td>
                    <form action={togglePayment} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={payment.id} />
                      <input type="hidden" name="status" value={payment.status} />
                      <span>{payment.status}</span>
                      <button type="submit" className="text-sm font-semibold text-rani underline">
                        {payment.status === "Pending" ? "Mark received" : "Undo"}
                      </button>
                    </form>
                  </td>
                  <td className="whitespace-nowrap">{formatDateTime(payment.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
