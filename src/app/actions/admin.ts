"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { UPLOAD_PREFIX } from "@/lib/images";
import { IMAGE_BUCKET } from "@/lib/supabase/config";
import { sessionClient } from "@/lib/supabase/server";
import type { FormState } from "./shop";

const MAX_IMAGE_BYTES = 3_000_000;

async function saveImage(file: File) {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be under 3 MB.");
  let body: Buffer;
  try {
    // Re-encoding rejects anything that is not really an image.
    body = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(900, 900, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new Error("That file is not a valid image.");
  }
  const name = `${Date.now()}-${file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.webp`;
  const supabase = await sessionClient();
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(name, body, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error("The image could not be uploaded. Please try again.");
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

  let image: string | undefined;
  if (hasUpload) {
    try {
      image = await saveImage(upload);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  const { name, price, categoryId, stockQuantity, stockStatus } = parsed.data;
  const values = {
    name,
    price,
    category_id: categoryId,
    featured: Boolean(form.get("featured")),
    stock_quantity: stockQuantity,
    stock_status: stockStatus,
    ...(image ? { image } : {}),
  };

  const supabase = await sessionClient();
  const { error } = id
    ? await supabase.from("products").update(values).eq("id", id)
    : await supabase.from("products").insert(values);
  if (error) return { error: "The product could not be saved. Please try again." };

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const supabase = await sessionClient();
  const { count } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);
  // Past orders and invoices need the product row, so ordered products are only hidden.
  if (count) {
    await supabase.from("products").update({ stock_status: "Out of Stock", featured: false }).eq("id", id);
  } else {
    await supabase.from("products").delete().eq("id", id);
  }
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(form: FormData) {
  await requireAdmin();
  const status = z.enum(["Pending", "Confirmed", "Delivered"]).parse(form.get("status"));
  const supabase = await sessionClient();
  const { error } = await supabase.rpc("update_order_status", {
    p_order_id: Number(form.get("orderId")),
    p_status: status,
  });
  if (error) throw error;
  revalidatePath("/admin/orders");
}

export async function togglePayment(form: FormData) {
  await requireAdmin();
  const supabase = await sessionClient();
  const next = form.get("status") === "Pending" ? "Completed" : "Pending";
  await supabase.from("payments").update({ status: next }).eq("id", Number(form.get("id")));
  revalidatePath("/admin/payments");
}

const offerSchema = z.object({
  description: z.string().trim().min(1, "Please enter the offer text.").max(255),
  discount: z.coerce.number().min(0).max(100),
  start_date: z.iso.date("Please choose a start date."),
  end_date: z.iso.date("Please choose an end date."),
});

export async function createOffer(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = offerSchema.safeParse({
    description: form.get("description"),
    discount: form.get("discount") || 0,
    start_date: form.get("startDate"),
    end_date: form.get("endDate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await sessionClient();
  const { error } = await supabase.from("offers").insert(parsed.data);
  if (error) return { error: "The offer could not be saved. Please try again." };
  revalidatePath("/admin/offers");
  return { success: "Offer added." };
}

export async function toggleOffer(form: FormData) {
  await requireAdmin();
  const supabase = await sessionClient();
  await supabase
    .from("offers")
    .update({ active: form.get("active") !== "true" })
    .eq("id", Number(form.get("id")));
  revalidatePath("/admin/offers");
}

export async function deleteOffer(form: FormData) {
  await requireAdmin();
  const supabase = await sessionClient();
  await supabase.from("offers").delete().eq("id", Number(form.get("id")));
  revalidatePath("/admin/offers");
}

const reviewSchema = z.object({
  customer_name: z.string().trim().min(1, "Please enter the customer name.").max(150),
  rating: z.coerce.number().int().min(1).max(5),
  review_text: z.string().trim().min(1, "Please enter the review.").max(1000),
});

export async function createReview(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = reviewSchema.safeParse({
    customer_name: form.get("customerName"),
    rating: form.get("rating"),
    review_text: form.get("reviewText"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await sessionClient();
  const { error } = await supabase.from("reviews").insert(parsed.data);
  if (error) return { error: "The review could not be saved. Please try again." };
  revalidatePath("/admin/reviews");
  return { success: "Review added." };
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  const supabase = await sessionClient();
  await supabase.from("reviews").delete().eq("id", Number(form.get("id")));
  revalidatePath("/admin/reviews");
}
