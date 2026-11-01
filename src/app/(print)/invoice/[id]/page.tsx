import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintButton } from "@/components/print-button";
import { formatDate, formatTime, getOrder } from "@/lib/orders";
import { deliveryPolicy, site } from "@/lib/site";

export const metadata: Metadata = { title: "Invoice", robots: { index: false } };

const money = (amount: number) => `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> };

export default function InvoicePage(props: Props) {
  return (
    <Suspense fallback={<p className="p-10 text-muted">Loading invoice...</p>}>
      <Invoice {...props} />
    </Suspense>
  );
}

async function Invoice({ params, searchParams }: Props) {
  const id = Number((await params).id);
  const { t } = await searchParams;
  const order = await getOrder(id, t);
  if (!order) notFound();

  const items = order.items;
  const bill_no = order.bill_no;
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const total = Number(order.total_amount);

  return (
    <div className="mx-auto max-w-3xl bg-white p-6 sm:my-8 sm:rounded-[var(--radius-soft)] sm:p-10 print:my-0 print:max-w-none print:p-0">
      <header className="flex flex-wrap justify-between gap-6">
        <div className="max-w-sm text-sm">
          <h1 className="font-display text-2xl font-extrabold text-rani">{site.name}</h1>
          <p className="mt-1">{site.addressLines.join(", ")}</p>
          <p>Phone: {site.phone}</p>
          <p>Email: {site.email}</p>
          <p>FSSAI No: {site.fssai}</p>
          <p>GSTIN: {site.gstin} (Incl. all tax)</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-display text-2xl font-extrabold text-rani">Invoice</p>
          <p className="mt-1">Bill No: {bill_no}</p>
          <p>Invoice: #{order.id}</p>
          <p>Date: {formatDate(order.created_at)}</p>
          <p>Time: {formatTime(order.created_at)}</p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.payment_method}</p>
        </div>
      </header>

      <section className="mt-6 rounded-lg bg-blush p-4 text-sm print:border print:border-line">
        <p className="font-semibold">Bill to</p>
        <p>{order.customer_name}</p>
        <p>Phone: {order.phone}</p>
        <p>{order.address}</p>
      </section>

      <table className="table-admin mt-6">
        <thead>
          <tr>
            <th>Item</th>
            <th className="text-right!">Qty</th>
            <th className="text-right!">Rate</th>
            <th className="text-right!">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.name}
                {item.weight ? ` (${item.weight})` : ""}
              </td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">{money(Number(item.price))}</td>
              <td className="text-right">{money(Number(item.price) * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 ml-auto grid max-w-xs gap-1 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd>{total - subtotal > 0 ? money(total - subtotal) : "Free"}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-1 text-base font-bold">
          <dt>Total bill</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-xs text-muted">
        This invoice is generated from the Shree Mohan Sweet and Namkeen order system. Please verify all details before
        payment. {deliveryPolicy}
      </p>

      <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
        <PrintButton />
        <Link href="/products" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
