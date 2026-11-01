import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">{children}</main>
      <SiteFooter />
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed right-4 bottom-4 z-20 rounded-full bg-mor p-3.5 text-white shadow-[0_8px_20px_rgb(14_107_60/0.35)] transition hover:scale-105"
      >
        <WhatsappLogoIcon size={26} weight="fill" />
      </a>
    </>
  );
}
