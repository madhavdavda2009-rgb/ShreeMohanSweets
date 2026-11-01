import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/admin";
import { query } from "@/lib/db";
import { productImageUrl } from "@/lib/images";
import { formatRupees } from "@/lib/pricing";
import { requireAdmin } from "@/lib/session";

type Row = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
  featured: number;
  stock_quantity: number;
  stock_status: string | null;
};

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await query<Row>(`
    SELECT p.id, p.name, p.price, p.image, c.name AS category, p.featured, p.stock_quantity, p.stock_status
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.price = 0 DESC, p.name`);

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
                  <td>{product.category ?? "Uncategorized"}</td>
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
