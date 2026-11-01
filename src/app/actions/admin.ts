"use server";

import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { RowDataPacket } from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { execute, query, transaction } from "@/lib/db";
import { UPLOAD_PREFIX, uploadDir } from "@/lib/images";
import { requireAdmin } from "@/lib/session";
import type { FormState } from "./shop";

const MAX_IMAGE_BYTES = 3_000_000;

async function saveImage(file: File) {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be under 3 MB.");
  const name = `${Date.now()}-${file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.webp`;
  await mkdir(uploadDir(), { recursive: true });
  try {
    // Re-encoding rejects anything that is not really an image.
    await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(900, 900, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(uploadDir(), name));
  } catch {
    throw new Error("That file is not a valid image.");
  }
  return `${UPLOAD_PREFIX}${name}`;
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Please enter a product name.").max(150),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  categoryId: z.coerce.number().int().positive("Please choose a category."),
  stockQuantity: z.coerce.number().int().min(0),
  stockStatus: z.enum(["Available", "Out of Stock"]),
});

export async function saveProduct(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    name: form.get("name"),
    price: form.get("price"),
    categoryId: form.get("categoryId"),
    stockQuantity: form.get("stockQuantity"),
    stockStatus: form.get("stockStatus"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = Number(form.get("id")) || null;
  const upload = form.get("image");
  const hasUpload = upload instanceof File && upload.size > 0;
  if (!id && !hasUpload) return { error: "Please upload a product image." };

  let image: string | null = null;
  if (hasUpload) {
    try {
      image = await saveImage(upload);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  const { name, price, categoryId, stockQuantity, stockStatus } = parsed.data;
  const featured = form.get("featured") ? 1 : 0;

  if (id) {
    await execute(
      `UPDATE products SET name = ?, price = ?, category_id = ?, featured = ?, stock_quantity = ?, stock_status = ?,
       image = COALESCE(?, image) WHERE id = ?`,
      [name, price, categoryId, featured, stockQuantity, stockStatus, image, id],
    );
  } else {
    await execute(
      "INSERT INTO products (name, price, category_id, image, featured, stock_quantity, stock_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, price, categoryId, image, featured, stockQuantity, stockStatus],
    );
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const used = await query("SELECT 1 FROM order_items WHERE product_id = ? LIMIT 1", [id]);
  // Past orders and invoices need the product row, so ordered products are only hidden.
  if (used.length > 0) {
    await execute("UPDATE products SET stock_status = 'Out of Stock', featured = 0 WHERE id = ?", [id]);
  } else {
    await execute("DELETE FROM products WHERE id = ?", [id]);
  }
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("orderId"));
  const status = z.enum(["Pending", "Confirmed", "Delivered"]).parse(form.get("status"));

  await transaction(async (tx) => {
    const [rows] = await tx.query<RowDataPacket[]>("SELECT stock_applied FROM orders WHERE id = ? FOR UPDATE", [id]);
    if (rows.length === 0) return;
    await tx.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    // Stock leaves the shelf once, the first time an order is accepted.
    if (status !== "Pending" && !rows[0].stock_applied) {
      await tx.execute(
        `UPDATE products p JOIN order_items oi ON oi.product_id = p.id
         SET p.stock_quantity = GREATEST(p.stock_quantity - oi.quantity, 0) WHERE oi.order_id = ?`,
        [id],
      );
      await tx.execute("UPDATE orders SET stock_applied = 1 WHERE id = ?", [id]);
    }
  });
  revalidatePath("/admin/orders");
}

export async function togglePayment(form: FormData) {
  await requireAdmin();
  await execute("UPDATE payments SET status = IF(status = 'Pending', 'Completed', 'Pending') WHERE id = ?", [
    Number(form.get("id")),
  ]);
  revalidatePath("/admin/payments");
}

const offerSchema = z.object({
  description: z.string().trim().min(1, "Please enter the offer text.").max(255),
  discount: z.coerce.number().min(0).max(100),
  startDate: z.iso.date("Please choose a start date."),
  endDate: z.iso.date("Please choose an end date."),
});

export async function createOffer(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = offerSchema.safeParse({
    description: form.get("description"),
    discount: form.get("discount") || 0,
    startDate: form.get("startDate"),
    endDate: form.get("endDate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { description, discount, startDate, endDate } = parsed.data;
  await execute("INSERT INTO offers (description, discount, start_date, end_date, active) VALUES (?, ?, ?, ?, 1)", [
    description,
    discount,
    startDate,
    endDate,
  ]);
  revalidatePath("/admin/offers");
  return { success: "Offer added." };
}

export async function toggleOffer(form: FormData) {
  await requireAdmin();
  await execute("UPDATE offers SET active = NOT active WHERE id = ?", [Number(form.get("id"))]);
  revalidatePath("/admin/offers");
}

export async function deleteOffer(form: FormData) {
  await requireAdmin();
  await execute("DELETE FROM offers WHERE id = ?", [Number(form.get("id"))]);
  revalidatePath("/admin/offers");
}

const reviewSchema = z.object({
  customerName: z.string().trim().min(1, "Please enter the customer name.").max(150),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().min(1, "Please enter the review.").max(1000),
});

export async function createReview(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = reviewSchema.safeParse({
    customerName: form.get("customerName"),
    rating: form.get("rating"),
    reviewText: form.get("reviewText"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await execute("INSERT INTO reviews (customer_name, rating, review_text) VALUES (?, ?, ?)", [
    parsed.data.customerName,
    parsed.data.rating,
    parsed.data.reviewText,
  ]);
  revalidatePath("/admin/reviews");
  return { success: "Review added." };
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  await execute("DELETE FROM reviews WHERE id = ?", [Number(form.get("id"))]);
  revalidatePath("/admin/reviews");
}
