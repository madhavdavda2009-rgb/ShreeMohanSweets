"use client";

import type { ReactNode } from "react";

// The header survives client navigation, so the open <details> has to be closed by hand.
export function MobileNav({ children }: { children: ReactNode }) {
  return (
    <nav
      aria-label="Mobile"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open");
      }}
      className="menu-in fixed inset-x-0 top-20 grid gap-1 border-b border-line bg-paper p-4 shadow-[0_12px_24px_rgb(86_12_54/0.12)]"
    >
      {children}
    </nav>
  );
}
