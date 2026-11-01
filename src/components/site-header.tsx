import { HeartIcon, ListIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { HeaderShell, ScrollProgress } from "./animated";
import { CartLink } from "./cart-link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/legacy", label: "Our Legacy" },
  { href: "/about", label: "About" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <HeaderShell>
      <ScrollProgress />
      <div className="page flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Shree Mohan Sweets and Namkeen home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link font-medium transition hover:text-rani">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/wishlist" aria-label="Wishlist" className="hidden p-2.5 hover:text-rani sm:block">
            <HeartIcon size={24} />
          </Link>
          <Link href="/account/orders" aria-label="My account" className="hidden p-2.5 hover:text-rani sm:block">
            <UserIcon size={24} />
          </Link>
          <CartLink />

          <details className="group relative lg:hidden">
            <summary className="block cursor-pointer list-none p-2.5" aria-label="Menu">
              <ListIcon size={26} />
            </summary>
            <MobileNav>
              {[
                ...links,
                { href: "/wishlist", label: "Wishlist" },
                { href: "/account/orders", label: "My Account" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 font-medium hover:bg-blush">
                  {link.label}
                </Link>
              ))}
            </MobileNav>
          </details>
        </div>
      </div>
    </HeaderShell>
  );
}
