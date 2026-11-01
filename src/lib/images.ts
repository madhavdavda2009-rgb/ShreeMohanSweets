import "server-only";
import productImages from "./product-images.json";
import { IMAGE_BUCKET, SUPABASE_URL } from "./supabase/config";

export const UPLOAD_PREFIX = "uploads/";

// Written by scripts/prepare-images.mjs. public/ is not on disk on serverless hosts.
const bundledImages = new Set(productImages);

// Database values are either catalogue filenames ("Kaju_Katli.jpg"), which map onto the
// files in public/products, or "uploads/..." for images added in the admin panel.
export function productImageUrl(image: string | null) {
  if (!image) return null;
  if (image.startsWith(UPLOAD_PREFIX)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${image.slice(UPLOAD_PREFIX.length)}`;
  }
  const slug = image
    .trim()
    .replace(/(\.(jpe?g|png|gif|webp))+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const file = `${slug}.webp`;
  return bundledImages.has(file) ? `/products/${file}` : null;
}
