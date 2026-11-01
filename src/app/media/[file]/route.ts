import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadDir } from "@/lib/images";

// Admin uploads live outside public/, which is fixed at build time.
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]+\.webp$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(path.join(uploadDir(), file));
    return new Response(body, {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
