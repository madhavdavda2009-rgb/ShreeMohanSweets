import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/catalog";
import { categoryLabels } from "@/lib/site";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categoryId = Number(params.category) || undefined;
  const search = params.search?.trim() || undefined;
  const products = await getProducts({ categoryId, search });

  const tabs = [
    { href: "/products", label: "All", active: !categoryId },
    ...Object.entries(categoryLabels).map(([id, category]) => ({
      href: `/products?category=${id}`,
      label: category.label,
      active: categoryId === Number(id),
    })),
  ];

  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-6xl">
        {categoryId ? categoryLabels[categoryId]?.label ?? "Products" : "Our products"}
      </h1>

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Categories" className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`rounded-lg px-4 py-2 font-semibold whitespace-nowrap transition ${
                tab.active ? "bg-rani text-white" : "hover:bg-blush"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form action="/products" className="relative w-full lg:w-80">
          {categoryId && <input type="hidden" name="category" value={categoryId} />}
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <input id="search" name="search" type="search" defaultValue={search} placeholder="Search products" className="input pr-11" />
          <button type="submit" aria-label="Search" className="absolute top-1/2 right-3 -translate-y-1/2 text-muted">
            <MagnifyingGlassIcon size={20} />
          </button>
        </form>
      </div>

      {products.length > 0 ? (
        <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-14 text-center">
          <p className="font-display text-2xl font-bold">No products found</p>
          <p className="mt-2 text-muted">Try another name, or browse all products.</p>
          <Link href="/products" className="btn-secondary mt-5">
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}
