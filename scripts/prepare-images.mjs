// Converts source images in assets-src/ into web-ready files under public/.
// Product output names are derived from the source filename, so image values already
// stored in the database keep working (see src/lib/images.ts).
import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PRODUCTS_IN = path.join(ROOT, "assets-src/products");
const PRODUCTS_OUT = path.join(ROOT, "public/products");
const PHOTOS_OUT = path.join(ROOT, "public/photos");

function imageSlug(file) {
  return file
    .replace(/(\.(jpe?g|png|gif|webp))+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

await mkdir(PRODUCTS_OUT, { recursive: true });
await mkdir(PHOTOS_OUT, { recursive: true });

// Optional: drop old admin uploads or new product photos into assets-src/products.
const sources = existsSync(PRODUCTS_IN) ? await readdir(PRODUCTS_IN) : [];
for (const file of sources) {
  await sharp(path.join(PRODUCTS_IN, file))
    .rotate()
    .resize(720, 720, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(PRODUCTS_OUT, `${imageSlug(file)}.webp`));
}

// Current shop front, from the shop's Instagram post of 28 July 2026 (1440px square).
await sharp(path.join(ROOT, "assets-src/shop-front-instagram.webp"))
  .resize({ width: 1920, kernel: "lanczos3" })
  .webp({ quality: 86 })
  .toFile(path.join(PHOTOS_OUT, "shop-front-2026.webp"));

console.log(`${sources.length} product images and 1 photo written`);
