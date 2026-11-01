import "server-only";
import { readdirSync } from "node:fs";
import path from "node:path";

export const UPLOAD_PREFIX = "uploads/";

let bundled: Set<string> | undefined;

function bundledImages() {
  if (!bundled) {
    bundled = new Set(readdirSync(path.join(process.cwd(), "public/products")));
  }
  return bundled;
}

export function uploadDir() {
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "./storage/uploads");
}

// Database values are either legacy filenames ("Kaju_Katli.jpg"), which map onto the
// converted files in public/products, or "uploads/..." for images added in the admin.
export function productImageUrl(image: string | null) {
  if (!image) return null;
  if (image.startsWith(UPLOAD_PREFIX)) return `/media/${image.slice(UPLOAD_PREFIX.length)}`;
  const slug = image
    .trim()
    .replace(/(\.(jpe?g|png|gif|webp))+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const file = `${slug}.webp`;
  return bundledImages().has(file) ? `/products/${file}` : null;
}
