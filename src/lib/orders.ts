import "server-only";
import { query } from "./db";

export type Order = {
  id: number;
  customer_id: number | null;
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total_amount: number;
  status: "Pending" | "Confirmed" | "Delivered";
  created_at: string;
};

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  weight: string | null;
  price: number;
};

export async function getOrder(id: number) {
  const rows = await query<Order>("SELECT * FROM orders WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export function getOrderItems(orderId: number) {
  return query<OrderItem>(
    `SELECT oi.id, p.name, oi.quantity, oi.weight, oi.price
     FROM order_items oi JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId],
  );
}

export function getCustomerOrders(customerId: number) {
  return query<Order>("SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC", [customerId]);
}
