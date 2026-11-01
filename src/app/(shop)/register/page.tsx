"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";

export default function RegisterPage() {
  const [state, action] = useActionState(register, {});
  return (
    <div className="page max-w-md py-12 md:py-16">
      <h1 className="heading text-5xl">Create account</h1>
      <p className="mt-3 text-muted">Register to track your orders easily.</p>
      <ActionForm action={action} className="mt-8 grid gap-5">
        <FormNotice error={state.error} />
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required autoComplete="name" className="input" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required autoComplete="tel-national" className="input" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
          <p className="text-sm text-muted">At least 8 characters.</p>
        </div>
        <SubmitButton>Register</SubmitButton>
      </ActionForm>
      <p className="mt-5 text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-rani underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
}
