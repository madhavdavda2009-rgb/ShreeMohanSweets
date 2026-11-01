import { InstagramLogoIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/track-order", label: "Track order" },
    ],
  },
  {
    title: "Shree Mohan",
    links: [
      { href: "/legacy", label: "Our legacy" },
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-berry text-white">
      <div className="page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-[var(--radius-soft)] bg-blush p-3">
            <Logo className="h-20 w-auto" />
          </div>
          <address className="mt-5 not-italic text-white/90">
            {site.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <div className="mt-5 flex gap-2">
            <a href={site.phoneHref} aria-label="Call" className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20">
              <PhoneIcon size={22} />
            </a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20">
              <WhatsappLogoIcon size={22} />
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20">
              <InstagramLogoIcon size={22} />
            </a>
          </div>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="font-display text-lg font-bold">{group.title}</p>
            <ul className="mt-3 grid gap-2 text-white/90">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/15">
        <p className="page py-4 text-sm text-white/75">
          GSTIN {site.gstin}. FSSAI {site.fssai}. © 1979 Shree Mohan Sweets and Namkeen.
        </p>
      </div>
    </footer>
  );
}
