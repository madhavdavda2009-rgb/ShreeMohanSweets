import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

const reasons = [
  "Over 47 years of experience",
  "Freshly prepared daily",
  "Trusted by families across the city",
  "Fast service and caring support",
];

export default function AboutPage() {
  return (
    <div className="page grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <div>
        <h1 className="heading text-5xl md:text-7xl">Serving tradition, flavor and quality since 1979.</h1>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">
          Shree Mohan Sweets and Namkeen has been serving authentic sweets, farsan, namkeen, and snacks since 1979.
          With a strong commitment to quality, tradition, and customer satisfaction, we continue to bring fresh products
          and memorable flavors to thousands of happy customers.
        </p>
        <h2 className="heading mt-10 text-3xl">Our philosophy</h2>
        <p className="mt-3 max-w-[62ch] text-lg leading-relaxed">
          Every product is made with premium ingredients, care, and a commitment to taste. We believe in creating joyful
          moments through sweets and namkeen that feel familiar and special.
        </p>
        <h2 className="heading mt-10 text-3xl">Why trust us</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {reasons.map((reason) => (
            <li key={reason} className="rounded-[var(--radius-soft)] bg-blush px-4 py-3 font-medium">
              {reason}
            </li>
          ))}
        </ul>
        <Link href="/legacy" className="btn-secondary mt-8">
          Read our story
        </Link>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-soft)] lg:aspect-auto">
        <Image
          src="/photos/shop-front-2026.webp"
          alt="The Shree Mohan shop front in Paldi"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
