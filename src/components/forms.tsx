"use client";

import { createContext, useContext, useTransition, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

const PendingContext = createContext(false);

// React resets a <form action> after every submit, which would wipe a customer's
// address when validation fails. Once hydrated this submits the same data without
// the reset. The action prop stays on the form so a submit before hydration is still
// a server action POST and never a GET with the fields in the URL.
export function ActionForm({
  action,
  ...props
}: Omit<ComponentProps<"form">, "action" | "onSubmit"> & { action: (data: FormData) => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <PendingContext.Provider value={pending}>
      <form
        {...props}
        action={action}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => action(data));
        }}
      />
    </PendingContext.Provider>
  );
}

export function SubmitButton({ children, className = "btn-primary" }: { children: React.ReactNode; className?: string }) {
  const { pending: formPending } = useFormStatus();
  const pending = useContext(PendingContext) || formPending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Please wait..." : children}
    </button>
  );
}

export function FormNotice({ error, success }: { error?: string; success?: string }) {
  if (error) return <p role="alert" className="notice-error">{error}</p>;
  if (success) return <p role="status" className="notice-success">{success}</p>;
  return null;
}
