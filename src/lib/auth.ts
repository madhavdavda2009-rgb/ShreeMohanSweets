import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "./supabase/server";

export async function getCustomer() {
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;
  // Display only: user_metadata is editable by the user, so it never decides access.
  const name = (data.claims.user_metadata as { name?: string } | undefined)?.name;
  return { id: data.claims.sub, name: name || "there" };
}

export async function requireCustomer() {
  const customer = await getCustomer();
  if (!customer) redirect("/login");
  return customer;
}

export async function isAdmin() {
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getClaims();
  return (data?.claims.app_metadata as { role?: string } | undefined)?.role === "admin";
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
