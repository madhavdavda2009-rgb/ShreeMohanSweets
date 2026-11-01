"use server";

import { z } from "zod";
import { getProductsByIds } from "@/lib/catalog";
import { formatDateTime, orderPath } from "@/lib/orders";
import { buildQuote } from "@/lib/quote";
import { publicClient, sessionClient } from "@/lib/supabase/server";

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

  // Run as the visitor so a signed-in customer's order is linked to their account.
  // The database prices the order itself from the product table.
  const supabase = await sessionClient();
  const { customerName, phone, address, paymentMethod } = parsed.data;
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: customerName,
    p_phone: phone,
    p_address: address,
    p_payment_method: paymentMethod,
    p_lines: quote.lines.map(({ productId, weight, quantity }) => ({ productId, weight, quantity })),
  });
  if (error) {
    return { error: error.code === "P0001" ? error.message : "Your order could not be placed. Please try again." };
  }

  return { redirectTo: orderPath({ id: data[0].order_id, access_token: data[0].access_token }) };
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
  const { error } = await publicClient.from("contact_messages").insert(parsed.data);
  if (error) return { error: "Your message could not be sent. Please try again." };
  return { success: "Thank you. Your message has been received and we will contact you soon." };
}

export type TrackState = {
  error?: string;
  order?: { id: number; status: string; total: number; date: string; link: string };
};

export async function trackOrder(_: TrackState, form: FormData): Promise<TrackState> {
  const id = Number(form.get("orderId"));
  const phone = String(form.get("phone") ?? "").trim();
  if (!Number.isSafeInteger(id) || id <= 0 || !/^[0-9]{10}$/.test(phone)) {
    return { error: "Please enter your order number and 10-digit phone number." };
  }
  const { data, error } = await publicClient.rpc("track_order", { p_order_id: id, p_phone: phone });
  if (error) return { error: "Your order could not be checked. Please try again." };
  const order = data[0];
  if (!order) return { error: "No order found. Please check the order number and phone number." };
  return {
    order: {
      id: order.id,
      status: order.status,
      total: Number(order.total_amount),
      date: formatDateTime(order.created_at),
      link: orderPath(order),
    },
  };
}
