"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWishlistProducts } from "@/app/actions/shop";
import { AddToCart, WishlistButton } from "@/components/add-to-cart";
import { useWishlist } from "@/lib/browser-store";
import type { Product } from "@/lib/catalog";
import { formatRupees } from "@/lib/pricing";
import Image from "next/image";

export default function WishlistPage() {
  const ids = useWishlist();
  const [products, setProducts] = useState<Product[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    let current = true;
    getWishlistProducts(key ? key.split(",").map(Number) : []).then((result) => {
      if (current) setProducts(result);
    });
    return () => {
      current = false;
    };
  }, [key]);

  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">My wishlist</h1>
      {products && products.length === 0 && (
        <div className="mt-8">
          <p className="text-lg text-muted">No wishlist items yet. Tap the heart on any product to save it here.</p>
          <Link href="/products" className="btn-primary mt-5">
            Browse products
          </Link>
        </div>
      )}
      <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
        {products?.map((product) => (
          <article key={product.id}>
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-soft)] bg-blush">
              {product.imageUrl && (
                <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
              )}
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg leading-tight font-bold">{product.name}</h2>
                {product.price > 0 && <p className="text-sm text-muted">{formatRupees(product.price)} per kg</p>}
              </div>
              <WishlistButton id={product.id} name={product.name} />
            </div>
            <div className="mt-2.5">
              <AddToCart id={product.id} name={product.name} price={product.price} available={product.available} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
