import { ProductForm } from "@/components/product-form";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await query<{ id: number; name: string }>("SELECT id, name FROM categories ORDER BY id");
  return (
    <>
      <h1 className="heading text-4xl">Add product</h1>
      <ProductForm categories={categories} />
    </>
  );
}
