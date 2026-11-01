import type { Metadata } from "next";
import Image from "next/image";
import { Story } from "@/components/story";

export const metadata: Metadata = { title: "Our Legacy" };

const people = [
  {
    image: "/photos/founder.webp",
    name: "Shree Kambleshbhai Tulsiram Nagar",
    role: "Founder",
    text: "In 1979 he laid the foundation of the business and built a legacy of quality, trust, and authentic taste that continues today.",
    position: "object-[30%_25%]",
  },
  {
    image: "/photos/vijaybhai.webp",
    name: "Shree Vijaybhai Kambleshbhai Nagar",
    role: "Current leadership",
    text: "Since 2001 he has been leading the business and continuing the tradition of quality, customer satisfaction, and authentic products.",
    position: "object-[50%_40%]",
  },
];

export default function LegacyPage() {
  return (
    <>
      <div className="page py-10 md:py-14">
        <h1 className="heading text-5xl md:text-7xl">Legacy since 1979</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <figure className="lg:sticky lg:top-24 lg:self-start">
            <Image
              src="/photos/shop-1979.webp"
              alt="Black and white photograph of the original Mohan Chawana and Sweet Mart"
              width={1074}
              height={1023}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full rounded-[var(--radius-soft)]"
            />
            <figcaption className="mt-3 text-sm text-muted">The original shop, Mohan Chawana & Sweet Mart.</figcaption>
          </figure>
          <Story />
        </div>
      </div>
      <section className="bg-blush">
        <div className="page grid gap-10 py-14 md:grid-cols-2">
          {people.map((person) => (
            <article key={person.name} className="reveal grid gap-5 sm:grid-cols-[160px_1fr] sm:items-center">
              <div className="relative aspect-square w-40 overflow-hidden rounded-[var(--radius-soft)]">
                <Image src={person.image} alt={person.name} fill sizes="160px" className={`object-cover ${person.position}`} />
              </div>
              <div>
                <p className="font-semibold text-mor">{person.role}</p>
                <h2 className="font-display text-2xl leading-tight font-bold">{person.name}</h2>
                <p className="mt-2 text-muted">{person.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
