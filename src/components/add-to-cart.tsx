"use client";

import { CheckIcon, HeartIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/browser-store";
import { formatRupees, priceForWeight, WEIGHTS, type Weight } from "@/lib/pricing";
import { site } from "@/lib/site";
import { SHOW_HEADER_EVENT } from "./animated";

// A copy of the product photo arcs up into the cart icon, so an add registers from
// anywhere on a long page. The header slides back first so the icon is on screen.
function flyToCart(button: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const image = button.closest("article, li")?.querySelector("img");
  const cart = document.querySelector("[data-cart-link]");
  if (!image || !cart) return;
  window.dispatchEvent(new Event(SHOW_HEADER_EVENT));

  const from = image.getBoundingClientRect();
  const to = cart.getBoundingClientRect();
  const size = Math.min(from.width, 160);
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = 40 - size / 2;

  const flyer = new Image();
  flyer.src = image.currentSrc;
  flyer.alt = "";
  Object.assign(flyer.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "12px",
    zIndex: "50",
    pointerEvents: "none",
  });
  document.body.append(flyer);
  flyer
    .animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1 },
        {
          transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY)}px) scale(0.6)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: `translate(${endX}px, ${endY}px) scale(0.12)`, opacity: 0.3 },
      ],
      { duration: 750, easing: "cubic-bezier(0.5, 0, 0.2, 1)" },
    )
    .finished.finally(() => flyer.remove());
}

type Props = { id: number; name: string; price: number; available: boolean; tone?: "light" | "rani" };

export function AddToCart({ id, name, price, available, tone = "light" }: Props) {
  const [weight, setWeight] = useState<Weight>("500g");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  if (!available) {
    return <p className={`text-sm font-semibold ${tone === "rani" ? "text-white/80" : "text-muted"}`}>Out of stock</p>;
  }

  if (price <= 0) {
    return (
      <a
        href={`${site.whatsapp}?text=${encodeURIComponent(`Hi, what is the price of ${name}?`)}`}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-mor underline underline-offset-4"
      >
        Ask price on WhatsApp
      </a>
    );
  }

  const idle =
    tone === "rani" ? "border-white/40 text-white hover:border-white" : "border-line text-ink hover:border-rani";
  const active = tone === "rani" ? "border-gold bg-gold text-berry" : "border-rani bg-rani text-white";

  return (
    <div className="flex items-center gap-1.5">
      <div role="radiogroup" aria-label={`Weight for ${name}`} className="flex gap-1">
        {WEIGHTS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={weight === option}
            onClick={() => setWeight(option)}
            className={`rounded-lg border px-1.5 py-1.5 text-[11px] font-semibold transition sm:px-2 sm:text-xs ${weight === option ? active : idle}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label={`Add ${weight} of ${name}, ${formatRupees(priceForWeight(price, weight))}`}
        onClick={(event) => {
          flyToCart(event.currentTarget);
          addToCart(id, weight);
          setAdded(true);
        }}
        className={`ml-auto grid size-8 shrink-0 place-items-center rounded-lg transition active:scale-95 sm:size-9 ${
          tone === "rani" ? "bg-gold text-berry" : added ? "bg-mor text-white" : "bg-rani text-white hover:bg-rani-deep"
        }`}
      >
        {added ? <CheckIcon size={18} weight="bold" /> : <PlusIcon size={18} weight="bold" />}
      </button>
    </div>
  );
}

export function WishlistButton({ id, name }: { id: number; name: string }) {
  const saved = useWishlist().includes(id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => toggleWishlist(id)}
      className="p-1 text-rani transition active:scale-90"
    >
      <HeartIcon key={String(saved)} size={22} weight={saved ? "fill" : "regular"} className={saved ? "badge-pop" : undefined} />
    </button>
  );
}
