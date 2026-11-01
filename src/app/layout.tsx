import type { Metadata } from "next";
import { Baloo_Bhai_2, Mukta_Vaani } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Rounded and heavy like the logo lettering, with matching English and Gujarati.
const display = Baloo_Bhai_2({
  subsets: ["latin", "gujarati"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
});

const body = Mukta_Vaani({
  subsets: ["latin", "gujarati"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mukta",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} | Paldi, Ahmedabad`, template: `%s | ${site.name}` },
  description:
    "Sweets, farsan and namkeen made fresh every day in Paldi, Ahmedabad, since 1979. Order fafda, jalebi, kaju katli and more online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
