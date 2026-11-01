"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const chapters = [
  {
    year: "1979",
    text: "Shree Kambleshbhai Tulsiram Nagar opens Mohan Chawana & Sweet Mart.",
    image: "/photos/shop-1979.webp",
    alt: "Black and white photograph of the original Mohan Chawana and Sweet Mart with a scooter parked outside",
    position: "object-center",
  },
  {
    year: "2001",
    text: "His son, Shree Vijaybhai, takes over and grows the business.",
    image: "/photos/vijaybhai.webp",
    alt: "Shree Vijaybhai on the telephone at the shop counter in the early years",
    position: "object-[50%_45%]",
  },
  {
    year: "Today",
    text: "The same recipes, trusted by over 10,000 customers.",
    image: "/photos/shop-front-2026.webp",
    alt: "The Shree Mohan shop front in Paldi today",
    position: "object-[50%_30%]",
  },
];

function Slide({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const chapter = chapters[index];
  const start = index / chapters.length;
  const reduce = useReducedMotion();
  // Each later photo wipes up over the one before it.
  const enter = Math.max(start - 0.1, 0);
  const wipe = useTransform(progress, [enter, start + 0.08], [index === 0 || reduce ? 0 : 100, 0]);
  const scale = useTransform(progress, [enter, start + 0.4], [index === 0 || reduce ? 1 : 1.16, 1]);
  const clipPath = useMotionTemplate`inset(${wipe}% 0 0 0)`;
  return (
    <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src={chapter.image} alt={chapter.alt} fill sizes="55vw" className={`object-cover ${chapter.position}`} />
      </motion.div>
    </motion.div>
  );
}

function Chapter({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const chapter = chapters[index];
  const start = index / chapters.length;
  const end = (index + 1) / chapters.length;
  const last = index === chapters.length - 1;
  const opacity = useTransform(
    progress,
    // Scroll timelines reject offsets outside 0 to 1.
    [Math.max(start - 0.06, 0), start + 0.04, end - 0.06, Math.min(end + 0.02, 1)],
    [index === 0 ? 1 : 0.22, 1, 1, last ? 1 : 0.22],
  );
  return (
    <motion.li style={{ opacity }} className="grid grid-cols-[6rem_1fr] gap-4 xl:grid-cols-[8rem_1fr]">
      <span className="font-display text-3xl text-mor xl:text-4xl">{chapter.year}</span>
      <span className="pt-1 text-lg">{chapter.text}</span>
    </motion.li>
  );
}

// Desktop pins the section and turns scrolling into the shop's three chapters.
export function LegacyStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lineScale = useTransform(scrollYProgress, [0.02, 0.95], [0, 1]);

  return (
    <section>
      <div ref={ref} className="hidden h-[280vh] lg:block">
        <div className="sticky top-0 grid h-dvh grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-center gap-14 overflow-hidden">
          <div className="relative h-full">
            {chapters.map((chapter, index) => (
              <Slide key={chapter.year} index={index} progress={scrollYProgress} />
            ))}
          </div>
          <div className="pr-10 xl:pr-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
            <h2 className="heading text-5xl xl:text-6xl">Started in 1979. Still family run.</h2>
            <div className="relative mt-9 pl-6">
              <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-line" />
              <motion.span
                aria-hidden
                style={{ scaleY: lineScale }}
                className="absolute inset-y-0 left-0 w-0.5 origin-top bg-rani"
              />
              <ol className="grid gap-7">
                {chapters.map((chapter, index) => (
                  <Chapter key={chapter.year} index={index} progress={scrollYProgress} />
                ))}
              </ol>
            </div>
            <Link href="/legacy" className="btn-secondary mt-9">
              Read our story
            </Link>
          </div>
        </div>
      </div>

      <div className="page grid gap-9 py-16 lg:hidden">
        <h2 className="heading text-5xl">Started in 1979. Still family run.</h2>
        {chapters.map((chapter) => (
          <article key={chapter.year} className="reveal">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-soft)]">
              <Image src={chapter.image} alt={chapter.alt} fill sizes="100vw" className={`object-cover ${chapter.position}`} />
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-mor">{chapter.year}</p>
            <p className="mt-1">{chapter.text}</p>
          </article>
        ))}
        <Link href="/legacy" className="btn-secondary justify-self-start">
          Read our story
        </Link>
      </div>
    </section>
  );
}
