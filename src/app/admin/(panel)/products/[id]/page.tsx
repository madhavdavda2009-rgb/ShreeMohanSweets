import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  const [[product], categories] = await Promise.all([
    query<{
      id: number;
      name: string;
      price: number;
      category_id: number | null;
      featured: number;
      stock_quantity: number;
      stock_status: string | null;
    }>("SELECT id, name, price, category_id, featured, stock_quantity, stock_status FROM products WHERE id = ?", [id]),
    query<{ id: number; name: string }>("SELECT id, name FROM categories ORDER BY id"),
  ]);
  if (!product) notFound();
  return (
    <>
      <h1 className="heading text-4xl">Edit {product.name}</h1>
      <ProductForm product={product} categories={categories} />
    </>
  );
}
