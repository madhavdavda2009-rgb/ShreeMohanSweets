import type { NextConfig } from "next";

// Old PHP addresses keep working for search results and saved links.
const legacyPages: [string, string][] = [
  ["/index.php", "/"],
  ["/products.php", "/products"],
  ["/cart.php", "/cart"],
  ["/checkout.php", "/checkout"],
  ["/about.php", "/about"],
  ["/legacy.php", "/legacy"],
  ["/contact.php", "/contact"],
  ["/wishlist.php", "/wishlist"],
  ["/track-order.php", "/track-order"],
  ["/customer-login.php", "/login"],
  ["/customer-register.php", "/register"],
  ["/my-orders.php", "/account/orders"],
  ["/admin/login.php", "/admin/login"],
  ["/admin/dashboard.php", "/admin"],
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`)],
  },
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  async redirects() {
    return legacyPages.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
