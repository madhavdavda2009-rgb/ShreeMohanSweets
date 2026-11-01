import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { formatRupees } from "@/lib/pricing";
import { AddToCart, WishlistButton } from "./add-to-cart";

export function ProductImage({ src, name, sizes }: { src: string | null; name: string; sizes: string }) {
  if (!src) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-blush font-display text-5xl font-extrabold text-rani/40">
        {name.charAt(0)}
      </span>
    );
  }
  return <Image src={src} alt={name} fill sizes={sizes} className="object-cover transition duration-700 ease-out group-hover:scale-110" />;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="reveal group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-soft)] bg-white">
        <ProductImage src={product.imageUrl} name={product.name} sizes="(min-width: 1024px) 24vw, 50vw" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg leading-tight font-bold">{product.name}</h3>
          {product.price > 0 && (
            <p className="mt-0.5 text-sm text-muted">
              <span className="font-semibold text-mor">{formatRupees(product.price)}</span> per kg
            </p>
          )}
        </div>
        <WishlistButton id={product.id} name={product.name} />
      </div>
      <div className="mt-2.5">
        <AddToCart id={product.id} name={product.name} price={product.price} available={product.available} />
      </div>
    </article>
  );
}
