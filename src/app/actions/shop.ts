"use server";

import type { ResultSetHeader } from "mysql2/promise";
import { z } from "zod";
import { getProductsByIds } from "@/lib/catalog";
import { execute, query, transaction } from "@/lib/db";
import { buildQuote } from "@/lib/quote";
import { getCustomer, orderToken } from "@/lib/session";

export type FormState = { error?: string; success?: string };

export async function quoteCart(lines: unknown) {
  return buildQuote(lines);
}

export async function getWishlistProducts(ids: number[]) {
  return getProductsByIds(ids.filter(Number.isInteger).slice(0, 100));
}

const orderSchema = z.object({
  customerName: z.string().trim().min(1, "Please enter your name.").max(150),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number."),
  address: z.string().trim().min(1, "Please enter your delivery address.").max(1000),
  paymentMethod: z.enum(["UPI", "Cash on Delivery"]),
});

export type PlaceOrderState = FormState & { redirectTo?: string };

export async function placeOrder(_: PlaceOrderState, form: FormData): Promise<PlaceOrderState> {
  const parsed = orderSchema.safeParse({
    customerName: form.get("customerName"),
    phone: form.get("phone"),
    address: form.get("address"),
    paymentMethod: form.get("paymentMethod"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let lines: unknown;
  try {
    lines = JSON.parse(String(form.get("lines")));
  } catch {
    return { error: "Your cart could not be read. Please try again." };
  }

  const quote = await buildQuote(lines);
  if (quote.lines.length === 0) return { error: "Your cart is empty." };
  const blocked = quote.lines.find((line) => !line.purchasable);
  if (blocked) return { error: `${blocked.name} is not available to order online right now.` };

  const customer = await getCustomer();
  const { customerName, phone, address, paymentMethod } = parsed.data;

  const orderId = await transaction(async (tx) => {
    const [order] = await tx.execute<ResultSetHeader>(
      `INSERT INTO orders (customer_id, customer_name, phone, address, payment_method, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [customer?.id ?? null, customerName, phone, address, paymentMethod, quote.total],
    );
    for (const line of quote.lines) {
      await tx.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, weight, price) VALUES (?, ?, ?, ?, ?)",
        [order.insertId, line.productId, line.quantity, line.weight, line.unitPrice],
      );
    }
    await tx.execute("INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, 'Pending')", [
      order.insertId,
      quote.total,
      paymentMethod,
    ]);
    return order.insertId;
  });

  return { redirectTo: `/orders/${orderId}?t=${orderToken(orderId)}` };
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(150),
  email: z.email("Please enter a valid email.").max(150),
  message: z.string().trim().min(1, "Please write a message.").max(4000),
});

export async function sendMessage(_: FormState, form: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    message: form.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await execute("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", [
    parsed.data.name,
    parsed.data.email,
    parsed.data.message,
  ]);
  return { success: "Thank you. Your message has been received and we will contact you soon." };
}

export type TrackState = {
  error?: string;
  order?: { id: number; status: string; total: number; date: string; link: string };
};

export async function trackOrder(_: TrackState, form: FormData): Promise<TrackState> {
  const id = Number(form.get("orderId"));
  const phone = String(form.get("phone") ?? "").trim();
  if (!Number.isInteger(id) || id <= 0 || !/^[0-9]{10}$/.test(phone)) {
    return { error: "Please enter your order number and 10-digit phone number." };
  }
  const rows = await query<{ id: number; status: string; total_amount: number; created_at: string }>(
    "SELECT id, status, total_amount, created_at FROM orders WHERE id = ? AND phone = ?",
    [id, phone],
  );
  const order = rows[0];
  if (!order) return { error: "No order found. Please check the order number and phone number." };
  return {
    order: {
      id: order.id,
      status: order.status,
      total: Number(order.total_amount),
      date: order.created_at,
      link: `/orders/${order.id}?t=${orderToken(order.id)}`,
    },
  };
}
