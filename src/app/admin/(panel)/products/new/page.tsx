import { ProductForm } from "@/components/product-form";
import { requireAdmin } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: categories, error } = await supabase.from("categories").select("id, name").order("id");
  if (error) throw error;
  return (
    <>
      <h1 className="heading text-4xl">Add product</h1>
      <ProductForm categories={categories} />
    </>
  );
}
