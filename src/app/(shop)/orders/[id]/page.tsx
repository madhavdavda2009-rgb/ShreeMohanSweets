import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getOrder, getOrderItems } from "@/lib/orders";
import { formatRupees } from "@/lib/pricing";
import { getCustomer, isAdmin, isValidOrderToken, orderToken } from "@/lib/session";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const id = Number((await params).id);
  const { t } = await searchParams;
  const order = Number.isInteger(id) ? await getOrder(id) : null;
  if (!order) notFound();

  const customer = await getCustomer();
  const allowed =
    isValidOrderToken(id, t) || (customer && customer.id === order.customer_id) || (await isAdmin());
  if (!allowed) notFound();

  const items = await getOrderItems(id);
  const total = Number(order.total_amount);
  const payByUpi = order.payment_method === "UPI" && order.status === "Pending";
  const upiLink = `upi://pay?${new URLSearchParams({
    pa: site.upiId,
    pn: site.upiName,
    am: total.toFixed(2),
    cu: "INR",
    tn: `Order ${id}`,
  })}`;
  const qr = payByUpi ? await QRCode.toDataURL(upiLink, { width: 280, margin: 1 }) : null;
  const whatsappText = encodeURIComponent(`Hi, this is about order ${id} for ${formatRupees(total)}.`);

  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">Order #{id}</h1>
      <p className="mt-3 text-lg text-muted">
        Status: <strong className="text-mor">{order.status}</strong>. We will confirm your order on {order.phone}.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <section>
          <ul className="grid gap-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.name}
                  {item.weight ? `, ${item.weight}` : ""} x {item.quantity}
                </span>
                <span className="font-medium">{formatRupees(Number(item.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-line pt-3 font-display text-2xl font-extrabold">
            <span>Total</span>
            <span>{formatRupees(total)}</span>
          </p>
          <p className="mt-4 text-muted">{order.address}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/invoice/${id}?t=${orderToken(id)}`} target="_blank" className="btn-secondary">
              View Invoice
            </Link>
            <a href={`${site.whatsapp}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="btn-green">
              Message on WhatsApp
            </a>
          </div>
        </section>

        {qr && (
          <section className="rounded-[var(--radius-soft)] bg-blush p-6">
            <h2 className="font-display text-2xl font-bold">Pay {formatRupees(total)} by UPI</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-[180px_1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={`UPI QR code to pay ${formatRupees(total)}`} width={180} height={180} className="rounded-lg" />
              <div>
                <p className="text-sm text-muted">UPI ID</p>
                <p className="font-semibold break-all">{site.upiId}</p>
                <p className="mt-3 text-sm text-muted">
                  Scan with any UPI app, then send the payment screenshot on WhatsApp with your order number.
                </p>
                <a href={upiLink} className="btn-primary mt-4 sm:hidden">
                  Open UPI App
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
