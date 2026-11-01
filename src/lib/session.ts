import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CUSTOMER_COOKIE = "smsn_customer";
const ADMIN_COOKIE = "smsn_admin";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return value;
}

async function write(cookie: string, payload: Record<string, unknown>, maxAge: number) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(new TextEncoder().encode(secret()));
  (await cookies()).set(cookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

async function read(cookie: string) {
  const token = (await cookies()).get(cookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret()));
    return payload;
  } catch {
    return null;
  }
}

export type CustomerSession = { id: number; name: string };

export function startCustomerSession(customer: CustomerSession) {
  return write(CUSTOMER_COOKIE, customer, 60 * 60 * 24 * 30);
}

export async function getCustomer() {
  const payload = await read(CUSTOMER_COOKIE);
  return payload ? { id: Number(payload.id), name: String(payload.name) } : null;
}

export async function requireCustomer() {
  const customer = await getCustomer();
  if (!customer) redirect("/login");
  return customer;
}

export async function endCustomerSession() {
  (await cookies()).delete(CUSTOMER_COOKIE);
}

export function startAdminSession() {
  return write(ADMIN_COOKIE, { admin: true }, 60 * 60 * 12);
}

export async function isAdmin() {
  return (await read(ADMIN_COOKIE))?.admin === true;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

// The PHP invoice page opened for any order number, exposing customer addresses.
// Invoice and order links now carry a signature tied to the order id.
export function orderToken(orderId: number) {
  return createHmac("sha256", secret()).update(`order:${orderId}`).digest("base64url").slice(0, 24);
}

export function isValidOrderToken(orderId: number, token: string | undefined) {
  if (!token) return false;
  const expected = Buffer.from(orderToken(orderId));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
