import type { Metadata } from "next";
import Link from "next/link";
import { adminLogout } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <header className="bg-berry text-white">
        <div className="page flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
          <Link href="/" className="font-display text-xl font-extrabold">
            Shree Mohan
          </Link>
          <nav aria-label="Admin" className="flex flex-1 flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={adminLogout}>
            <button type="submit" className="text-sm font-medium underline">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="page py-8">{children}</main>
    </div>
  );
}
