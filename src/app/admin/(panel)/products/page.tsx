import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { productImageUrl } from "@/lib/images";
import { formatRupees } from "@/lib/pricing";
import { sessionClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, featured, stock_quantity, stock_status, categories(name)")
    .order("name");
  if (error) throw error;
  // Products still missing a price come first, so they are easy to work through.
  const products = data.sort((a, b) => Number(b.price === 0) - Number(a.price === 0));

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="heading text-4xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="table-admin min-w-[720px]">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price / kg</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const src = productImageUrl(product.image);
              return (
                <tr key={product.id}>
                  <td>
                    <div className="relative size-12 overflow-hidden rounded-lg bg-blush">
                      {src && <Image src={src} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                  </td>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.categories?.name ?? "Uncategorized"}</td>
                  <td>
                    {Number(product.price) > 0 ? (
                      formatRupees(Number(product.price))
                    ) : (
                      <span className="font-semibold text-rani-deep">Not set</span>
                    )}
                  </td>
                  <td>{product.stock_status === "Out of Stock" ? "Out of stock" : product.stock_quantity}</td>
                  <td>{product.featured ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="font-semibold text-rani underline">
                        Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-muted underline hover:text-rani">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
