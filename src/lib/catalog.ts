import "server-only";
import { connection } from "next/server";
import { query } from "./db";
import { productImageUrl } from "./images";

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

type ProductRow = {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
  category: string | null;
  image: string | null;
  stock_status: string | null;
};

const SELECT_PRODUCT = `
  SELECT p.id, p.name, p.price, p.category_id, c.name AS category, p.image, p.stock_status
  FROM products p LEFT JOIN categories c ON p.category_id = c.id`;

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    categoryId: row.category_id,
    category: row.category,
    image: row.image,
    imageUrl: productImageUrl(row.image),
    available: row.stock_status !== "Out of Stock",
  };
}

export async function getFeaturedProducts(limit = 8) {
  await connection();
  const rows = await query<ProductRow>(
    `${SELECT_PRODUCT} WHERE p.featured = 1 AND p.price > 0 ORDER BY p.price DESC LIMIT ?`,
    [limit],
  );
  return rows.map(toProduct);
}

export async function getProducts({ categoryId, search }: { categoryId?: number; search?: string }) {
  await connection();
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (categoryId) {
    where.push("p.category_id = ?");
    params.push(categoryId);
  }
  if (search) {
    where.push("p.name LIKE ?");
    params.push(`%${search}%`);
  }
  const rows = await query<ProductRow>(
    `${SELECT_PRODUCT} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY p.price = 0, p.featured DESC, p.name`,
    params,
  );
  return rows.map(toProduct);
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const rows = await query<ProductRow>(
    `${SELECT_PRODUCT} WHERE p.id IN (${ids.map(() => "?").join(",")})`,
    ids,
  );
  return rows.map(toProduct);
}

export async function getActiveOffer() {
  await connection();
  const rows = await query<{ description: string }>(
    "SELECT description FROM offers WHERE active = 1 AND end_date >= CURDATE() ORDER BY created_at DESC LIMIT 1",
  );
  return rows[0]?.description ?? null;
}

export async function getReviews(limit = 3) {
  await connection();
  return query<{ id: number; customer_name: string; rating: number; review_text: string }>(
    "SELECT id, customer_name, rating, review_text FROM reviews ORDER BY rating DESC, created_at DESC LIMIT ?",
    [limit],
  );
}
