import { togglePayment } from "@/app/actions/admin";
import { query } from "@/lib/db";
import { formatRupees } from "@/lib/pricing";
import { requireAdmin } from "@/lib/session";

export default async function PaymentsPage() {
  await requireAdmin();
  const payments = await query<{
    id: number;
    order_id: number;
    customer_name: string;
    amount: number;
    method: string;
    status: string;
    created_at: string;
  }>(`SELECT p.id, p.order_id, o.customer_name, p.amount, p.method, p.status, p.created_at
      FROM payments p JOIN orders o ON p.order_id = o.id ORDER BY p.id DESC LIMIT 200`);

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
                  <td>{payment.customer_name}</td>
                  <td>{formatRupees(Number(payment.amount))}</td>
                  <td>{payment.method}</td>
                  <td>
                    <form action={togglePayment} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={payment.id} />
                      <span>{payment.status}</span>
                      <button type="submit" className="text-sm font-semibold text-rani underline">
                        {payment.status === "Pending" ? "Mark received" : "Undo"}
                      </button>
                    </form>
                  </td>
                  <td className="whitespace-nowrap">{payment.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
