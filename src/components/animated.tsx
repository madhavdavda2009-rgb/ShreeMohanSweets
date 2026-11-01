"use client";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Every effect here is scroll or pointer driven and starts from a readable state, so
// content is never hidden while waiting for JavaScript. Reduced motion turns them off.

export const SHOW_HEADER_EVENT = "smsn:show-header";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-rani" />;
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(current - previous) < 4) return;
    setHidden(current > previous && current > 240);
  });

  useEffect(() => {
    const show = () => setHidden(false);
    window.addEventListener(SHOW_HEADER_EVENT, show);
    return () => window.removeEventListener(SHOW_HEADER_EVENT, show);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden && !reduce ? "-100%" : "0%" }}
      transition={{ type: "spring", stiffness: 320, damping: 36 }}
      className="sticky top-0 z-30 bg-blush"
    >
      {children}
    </motion.header>
  );
}

// The shop photo is square, so a laptop can only show part of it at once. The hero pins
// on laptops and up while scrolling pans the photo from the sign down to the entrance.
// Phones show the whole square at the top, and tablets fill the screen with it.
export function HeroStage({ photo, children }: { photo: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pan = useTransform(scrollYProgress, [0, 1], [0.06, reduce ? 0.06 : 1]);
  return (
    <section ref={ref} className="relative bg-plum lg:h-[180dvh]">
      <div className="relative flex items-start overflow-hidden md:min-h-[calc(100dvh-80px)] md:items-end lg:sticky lg:top-0 lg:h-dvh">
        <motion.div
          style={{ "--pan": pan } as unknown as MotionStyle}
          className="absolute inset-x-0 top-0 aspect-square md:inset-0 md:aspect-auto lg:bottom-auto lg:aspect-square lg:min-h-full lg:[transform:translateY(calc(var(--pan)*min(0px,100dvh-100%)))]"
        >
          {photo}
        </motion.div>
        <div aria-hidden className="hero-scrim absolute inset-0" />
        {children}
      </div>
    </section>
  );
}

export function Magnetic({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });
  const reduce = useReducedMotion();
  return (
    <motion.span
      style={{ x: springX, y: springY }}
      className="inline-block"
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - box.left - box.width / 2) * 0.28);
        y.set((event.clientY - box.top - box.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

// Runs faster, and backwards, with the visitor's scroll.
export function VelocityMarquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const boost = useTransform(velocity, [-2500, 0, 2500], [-5, 0, 5]);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const scrollBoost = boost.get();
    if (scrollBoost < -0.1) direction.current = 1;
    else if (scrollBoost > 0.1) direction.current = -1;
    const next = offset.get() + direction.current * (delta / 1000) * (1.4 + Math.abs(scrollBoost) * 1.4);
    offset.set(((next % 50) - 50) % 50);
  });

  const x = useMotionTemplate`${offset}%`;
  const run = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-b border-line bg-blush py-4 md:py-5">
      <motion.ul style={{ x }} className="flex w-max gap-10 font-display text-2xl whitespace-nowrap text-berry md:gap-14 md:text-3xl">
        {run.map((item, index) => (
          <li key={index} className={index % 2 ? "text-mor" : undefined}>
            {item}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

// The photo opens out from a smaller window as it reaches the middle of the screen.
export function PhotoOpen({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 60%"] });
  const inset = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 11, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.22, 1]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round 12px)`;
  return (
    <motion.div ref={ref} style={{ clipPath }} className={className}>
      <motion.div style={{ scale }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SlideIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "center 62%"] });
  const x = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 56, 0]);
  return (
    <motion.div ref={ref} style={{ x }} className={className}>
      {children}
    </motion.div>
  );
}

// A band of colour that grows from a rounded card to full width.
export function ExpandBand({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "start 35%"] });
  const side = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 7, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 36, 0]);
  const clipPath = useMotionTemplate`inset(0 ${side}% round ${round}px)`;
  return (
    <motion.section ref={ref} style={{ clipPath }} className={className}>
      {children}
    </motion.section>
  );
}

function ScrubWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [reduce ? 1 : 0.18, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <ScrubWord
          key={index}
          word={word}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        />
      ))}
    </p>
  );
}
