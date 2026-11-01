"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";

export default function ChangePasswordPage() {
  const [state, action] = useActionState(changePassword, {});
  return (
    <div className="page max-w-md py-12 md:py-16">
      <h1 className="heading text-5xl">Change password</h1>
      <ActionForm action={action} className="mt-8 grid gap-5">
        <FormNotice error={state.error} success={state.success} />
        <div className="field">
          <label htmlFor="password">New password</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
          <p className="text-sm text-muted">At least 8 characters.</p>
        </div>
        <SubmitButton>Save Password</SubmitButton>
      </ActionForm>
      <Link href="/account/orders" className="mt-5 inline-block font-semibold text-rani underline underline-offset-4">
        Back to my account
      </Link>
    </div>
  );
}
