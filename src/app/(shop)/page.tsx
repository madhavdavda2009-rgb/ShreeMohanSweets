import { ArrowRightIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import {
  ExpandBand,
  HeroStage,
  Magnetic,
  PhotoOpen,
  ScrubText,
  SlideIn,
  VelocityMarquee,
} from "@/components/animated";
import { LegacyStory } from "@/components/legacy-story";
import { ProductImage } from "@/components/product-card";
import { getActiveOffer, getFeaturedProducts, getReviews } from "@/lib/catalog";
import { formatRupees } from "@/lib/pricing";
import { categoryLabels, deliveryPolicy, site } from "@/lib/site";

const marqueeItems = [
  "કાજુ કતરી",
  "Kaju Katli",
  "મોહનથાળ",
  "Mohan Thal",
  "ફાફડા",
  "Fafda",
  "જલેબી",
  "Jalebi",
  "ખમણ",
  "Khaman",
  "ગાંઠિયા",
  "Gathiya",
  "ચવાણું",
  "Chavanu",
  "પેંડા",
  "Penda",
];

function Words({ text, start = 0 }: { text: string; start?: number }) {
  return text.split(" ").map((word, index) => (
    <span key={index}>
      <span className="word">
        <span style={{ "--i": start + index } as React.CSSProperties}>{word}</span>
      </span>{" "}
    </span>
  ));
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryBar />
      <VelocityMarquee items={marqueeItems} />
      <FafdaJalebi />
      <ExpandBand className="bg-berry text-white">
        <div className="page py-16 md:py-24">
          <h2 className="font-display text-4xl leading-none font-extrabold tracking-tight md:text-5xl">
            Today&apos;s rate board
          </h2>
          <Suspense fallback={<RateBoardSkeleton />}>
            <RateBoard />
          </Suspense>
          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            See all products <ArrowRightIcon size={18} />
          </Link>
        </div>
      </ExpandBand>
      <LegacyStory />
      <Suspense fallback={null}>
        <Reviews />
      </Suspense>
      <Visit />
    </>
  );
}

function Hero() {
  return (
    <HeroStage
      photo={
        <Image
          src="/photos/shop-front-2026.webp"
          alt="The Shree Mohan shop front in Paldi with its pink logo sign, a balloon arch at the door and a man standing at the entrance"
          fill
          priority
          sizes="100vw"
          className="hero-zoom object-cover md:object-[50%_5%] lg:object-top"
        />
      }
    >
      <div className="page relative pt-[70vw] pb-9 text-white sm:pt-[62vw] md:pt-32 md:pb-12 lg:pb-28">
        <p className="rise font-display text-xl font-bold text-white/90">શ્રી મોહન સ્વીટ્સ એન્ડ નમકીન</p>
        <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.3rem,11vw,2.75rem)] leading-[1.08] font-extrabold tracking-tight [text-shadow:0_2px_20px_rgb(52_7_33/0.5)] sm:text-5xl lg:text-6xl xl:text-7xl">
          <Words text="Sweets and namkeen, made fresh every day." start={1} />
        </h1>
        <p className="rise mt-4 max-w-xl text-lg text-white/90" style={{ "--i": 8 } as React.CSSProperties}>
          Fafda, jalebi, mithai and farsan from the same family shop in Paldi, Ahmedabad, since 1979.
        </p>
        <div className="rise mt-7 flex flex-wrap gap-3" style={{ "--i": 9 } as React.CSSProperties}>
          <Magnetic>
            <Link href="/products" className="btn-primary">
              View Products
            </Link>
          </Magnetic>
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost">
            <WhatsappLogoIcon size={20} /> Order on WhatsApp
          </a>
        </div>
      </div>
    </HeroStage>
  );
}

function CategoryBar() {
  return (
    <nav aria-label="Shop by category" className="bg-berry text-white">
      <ul className="page grid grid-cols-2 md:grid-cols-4">
        {Object.entries(categoryLabels).map(([id, category]) => (
          <li key={id}>
            <Link
              href={`/products?category=${id}`}
              className="category-link group flex h-full items-end justify-between gap-2 px-3 py-5 md:py-7"
            >
              <span>
                <span className="block font-display text-3xl leading-none font-bold md:text-4xl">
                  {category.gujarati}
                </span>
                <span className="mt-1 block text-sm text-white/85">{category.label}</span>
              </span>
              <ArrowRightIcon size={22} className="transition group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FafdaJalebi() {
  return (
    <section className="page grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
      <PhotoOpen className="relative aspect-[3/2] md:col-span-8">
        <Image
          src="/photos/counter-fafda-jalebi.webp"
          alt="Fresh fafda and jalebi served with kadhi and green chillies on the Shree Mohan counter"
          fill
          sizes="(min-width: 768px) 62vw, 100vw"
          className="object-cover"
        />
      </PhotoOpen>
      <SlideIn className="relative md:col-span-4 md:-ml-20 md:rounded-[var(--radius-soft)] md:bg-paper md:p-8">
        <h2 className="heading text-4xl md:text-5xl">Hot fafda and jalebi</h2>
        <p className="mt-4 text-muted">Gujarati breakfast, served fresh on our counter every morning.</p>
        <Link href="/products?category=4" className="btn-primary mt-6">
          Shop Farsan
        </Link>
      </SlideIn>
    </section>
  );
}

async function RateBoard() {
  const [products, offer] = await Promise.all([getFeaturedProducts(8), getActiveOffer()]);
  return (
    <>
      {offer && <p className="mt-3 max-w-2xl text-white/90">{offer}</p>}
      <ul className="mt-9 grid gap-x-14 gap-y-6 md:grid-cols-2">
        {products.map((product) => (
          <li key={product.id} className="reveal group grid grid-cols-[64px_1fr] items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded-[var(--radius-soft)] bg-white">
              <ProductImage src={product.imageUrl} name={product.name} sizes="64px" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-display text-xl">{product.name}</h3>
                <span aria-hidden className="leader mb-1 flex-1 border-b-2 border-dotted border-white/40" />
                <p className="font-display text-xl text-gold">
                  {formatRupees(product.price)}
                  <span className="text-sm font-medium text-white/80">/kg</span>
                </p>
              </div>
              <div className="mt-1.5">
                <AddToCart
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  available={product.available}
                  tone="rani"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function RateBoardSkeleton() {
  return (
    <div className="mt-9 grid animate-pulse gap-x-14 gap-y-6 md:grid-cols-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-16 rounded-[var(--radius-soft)] bg-white/15" />
      ))}
    </div>
  );
}

async function Reviews() {
  const reviews = await getReviews(3);
  if (reviews.length === 0) return null;
  const [lead, ...rest] = reviews;
  return (
    <section className="bg-blush">
      <div className="page grid gap-10 py-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:py-20">
        <blockquote>
          <ScrubText
            text={`“${lead.review_text}”`}
            className="font-display text-3xl leading-tight text-berry md:text-5xl"
          />
          <footer className="mt-4 font-semibold">{lead.customer_name}</footer>
        </blockquote>
        <div className="grid content-center gap-7">
          {rest.map((review) => (
            <blockquote key={review.id} className="reveal">
              <p className="text-lg">“{review.review_text}”</p>
              <footer className="mt-1 text-sm font-semibold text-muted">{review.customer_name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="page py-14 md:max-w-none md:px-10 md:py-20 lg:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
        <h2 className="heading text-4xl md:text-5xl">Visit us in Paldi</h2>
        <address className="mt-4 text-lg not-italic">
          {site.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="mt-5 max-w-lg text-muted">{deliveryPolicy}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={site.phoneHref} className="btn-green">
            Call {site.phone}
          </a>
          <a href={site.mapLink} target="_blank" rel="noreferrer" className="btn-secondary">
            Get Directions
          </a>
        </div>
      </div>
      <iframe
        title="Map showing Shree Mohan Sweets and Namkeen in Paldi"
        src={site.mapEmbed}
        loading="lazy"
        className="reveal h-80 w-full border-0 md:h-full"
      />
    </section>
  );
}
