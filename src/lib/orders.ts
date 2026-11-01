import "server-only";
import { publicClient } from "./supabase/server";

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  weight: string | null;
  price: number;
};

export type OrderDetails = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  access_token: string;
  bill_no: number;
  items: OrderItem[];
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function orderPath(order: { id: number; access_token: string }, page: "orders" | "invoice" = "orders") {
  return `/${page}/${order.id}?t=${order.access_token}`;
}

// The private token in the link is the proof of access, for guests and customers alike.
export async function getOrder(id: number, token: string | undefined) {
  if (!Number.isSafeInteger(id) || !token || !UUID.test(token)) return null;
  const { data, error } = await publicClient.rpc("get_order", { p_order_id: id, p_token: token });
  if (error) throw error;
  return data as unknown as OrderDetails | null;
}

const IST = { timeZone: "Asia/Kolkata" } as const;

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", IST).replaceAll("/", "-");
}

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", IST);
}

export function formatDateTime(value: string) {
  return `${formatDate(value)} ${formatTime(value)}`;
}
