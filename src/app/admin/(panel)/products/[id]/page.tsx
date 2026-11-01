import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { requireAdmin } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  const supabase = await sessionClient();
  const [productResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, category_id, featured, stock_quantity, stock_status")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id, name").order("id"),
  ]);
  if (categoriesResult.error) throw categoriesResult.error;
  const product = productResult.data;
  if (!product) notFound();
  return (
    <>
      <h1 className="heading text-4xl">Edit {product.name}</h1>
      <ProductForm product={product} categories={categoriesResult.data} />
    </>
  );
}
