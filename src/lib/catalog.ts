import "server-only";
import { connection } from "next/server";
import { productImageUrl } from "./images";
import { publicClient } from "./supabase/server";

export type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number | null;
  category: string | null;
  image: string | null;
  imageUrl: string | null;
  available: boolean;
};

const PRODUCT_COLUMNS = "id, name, price, category_id, image, stock_status, categories(name)";

type ProductRow = {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
  image: string | null;
  stock_status: string;
  categories: { name: string } | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    categoryId: row.category_id,
    category: row.categories?.name ?? null,
    image: row.image,
    imageUrl: productImageUrl(row.image),
    available: row.stock_status !== "Out of Stock",
  };
}

export async function getFeaturedProducts(limit = 8) {
  await connection();
  const { data, error } = await publicClient
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("featured", true)
    .gt("price", 0)
    .order("price", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(toProduct);
}

export async function getProducts({ categoryId, search }: { categoryId?: number; search?: string }) {
  await connection();
  let query = publicClient.from("products").select(PRODUCT_COLUMNS);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.ilike("name", `%${search.replace(/[%_\\]/g, "\\$&")}%`);
  const { data, error } = await query.order("featured", { ascending: false }).order("name");
  if (error) throw error;
  // Priced products first, so "ask for price" items never push them down the page.
  return data.map(toProduct).sort((a, b) => Number(a.price === 0) - Number(b.price === 0));
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const { data, error } = await publicClient.from("products").select(PRODUCT_COLUMNS).in("id", ids);
  if (error) throw error;
  return data.map(toProduct);
}

export async function getActiveOffer() {
  await connection();
  // Row level security only returns live offers to the public.
  const { data, error } = await publicClient
    .from("offers")
    .select("description")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.description ?? null;
}

export async function getReviews(limit = 3) {
  await connection();
  const { data, error } = await publicClient
    .from("reviews")
    .select("id, customer_name, rating, review_text")
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
