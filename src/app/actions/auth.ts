"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdmin, requireCustomer } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
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
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  const supabase = await sessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone }, emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: error.message };

  // With email confirmation on, there is no session until the link is opened.
  if (!data.session) return { success: "Almost done. Please open the link we emailed you to confirm your account." };
  redirect("/account/orders");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await sessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please open the link we emailed you to confirm your account."
          : "Invalid email or password.",
    };
  }
  redirect("/account/orders");
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  await requireCustomer();
  const password = String(form.get("password") ?? "");
  if (password.length < 8 || password.length > 72) return { error: "Password must be at least 8 characters." };
  const supabase = await sessionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: "Your password has been changed." };
}

export async function logout() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await sessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error || data.user.app_metadata?.role !== "admin") {
    if (!error) await supabase.auth.signOut();
    return { error: "Invalid email or password." };
  }
  redirect("/admin");
}

export async function adminLogout() {
  if (await isAdmin()) {
    const supabase = await sessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
