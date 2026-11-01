"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";

export default function LoginPage() {
  const [state, action] = useActionState(login, {});
  return (
    <div className="page max-w-md py-12 md:py-16">
      <h1 className="heading text-5xl">Account login</h1>
      <ActionForm action={action} className="mt-8 grid gap-5">
        <FormNotice error={state.error} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        <SubmitButton>Sign In</SubmitButton>
      </ActionForm>
      <p className="mt-5 text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-rani underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
