"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/auth";
import { ActionForm, FormNotice, SubmitButton } from "@/components/forms";

export default function AdminLoginPage() {
  const [state, action] = useActionState(adminLogin, {});
  return (
    <div className="grid min-h-dvh place-items-center bg-blush p-4">
      <ActionForm action={action} className="grid w-full max-w-sm gap-5 rounded-[var(--radius-soft)] bg-white p-7">
        <h1 className="heading text-3xl">Admin login</h1>
        <FormNotice error={state.error} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" className="input" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        <SubmitButton>Login</SubmitButton>
      </ActionForm>
    </div>
  );
}
