"use client";

import { useActionState } from "react";
import { saveProduct } from "@/app/actions/admin";
import { ActionForm, FormNotice, SubmitButton } from "./forms";

type Values = {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
  featured: boolean;
  stock_quantity: number;
  stock_status: string | null;
};

export function ProductForm({ product, categories }: { product?: Values; categories: { id: number; name: string }[] }) {
  const [state, action] = useActionState(saveProduct, {});
  return (
    <ActionForm action={action} className="mt-6 grid max-w-xl gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <FormNotice error={state.error} />
      <div className="field">
        <label htmlFor="name">Product name</label>
        <input id="name" name="name" required defaultValue={product?.name} className="input" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="price">Price per kg (₹)</label>
          <input id="price" name="price" type="number" min={0} step="0.01" required defaultValue={product?.price} className="input" />
          <p className="text-sm text-muted">Enter 0 to show &quot;Ask price on WhatsApp&quot;.</p>
        </div>
        <div className="field">
          <label htmlFor="categoryId">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={product?.category_id ?? ""} className="input">
            <option value="" disabled>
              Choose category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="stockQuantity">Stock quantity</label>
          <input id="stockQuantity" name="stockQuantity" type="number" min={0} required defaultValue={product?.stock_quantity ?? 10} className="input" />
        </div>
        <div className="field">
          <label htmlFor="stockStatus">Availability</label>
          <select id="stockStatus" name="stockStatus" defaultValue={product?.stock_status ?? "Available"} className="input">
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of stock</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="image">{product ? "Replace image" : "Product image"}</label>
        <input id="image" name="image" type="file" accept="image/*" required={!product} className="input" />
        <p className="text-sm text-muted">JPG, PNG or WebP, up to 3 MB. Square photos look best.</p>
      </div>
      <label className="flex items-center gap-2 font-medium">
        <input type="checkbox" name="featured" defaultChecked={Boolean(product?.featured)} className="accent-rani" />
        Show on the homepage rate board
      </label>
      <SubmitButton className="btn-primary justify-self-start">{product ? "Save Changes" : "Add Product"}</SubmitButton>
    </ActionForm>
  );
}
