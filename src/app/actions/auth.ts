"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { execute, query } from "@/lib/db";
import {
  endAdminSession,
  endCustomerSession,
  startAdminSession,
  startCustomerSession,
} from "@/lib/session";
import type { FormState } from "./shop";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(150),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.email("Please enter a valid email.").max(150),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: form.get("name"),
    phone: form.get("phone"),
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, phone, email, password } = parsed.data;
  const existing = await query("SELECT id FROM customers WHERE email = ?", [email]);
  if (existing.length > 0) return { error: "An account with this email already exists." };

  const result = await execute("INSERT INTO customers (name, phone, email, password) VALUES (?, ?, ?, ?)", [
    name,
    phone,
    email,
    await bcrypt.hash(password, 12),
  ]);
  await startCustomerSession({ id: result.insertId, name });
  redirect("/account/orders");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const rows = await query<{ id: number; name: string; password: string }>(
    "SELECT id, name, password FROM customers WHERE email = ?",
    [email],
  );
  const customer = rows[0];
  // bcryptjs reads the $2y$ hashes written by PHP, so existing accounts keep working.
  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    return { error: "Invalid email or password." };
  }
  await startCustomerSession({ id: customer.id, name: customer.name });
  redirect("/account/orders");
}

export async function logout() {
  await endCustomerSession();
  redirect("/");
}

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const expectedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const hash = Buffer.from(process.env.ADMIN_PASSWORD_HASH ?? "", "base64").toString();
  if (!expectedEmail || !hash) return { error: "Admin login is not configured on this server." };

  const passwordMatches = await bcrypt.compare(password, hash);
  if (email !== expectedEmail || !passwordMatches) return { error: "Invalid email or password." };

  await startAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await endAdminSession();
  redirect("/admin/login");
}
