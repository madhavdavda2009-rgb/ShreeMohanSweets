# Shree Mohan Sweets and Namkeen

Next.js 16 storefront and admin panel, migrated from the shop's earlier PHP site.

## Run locally

Requires Node 20+. The data lives in Supabase, so no local database is needed.

```bash
npm install
```

```bash
copy .env.example .env.local
```

Fill in `.env.local`, then:

```bash
npm run dev
```

Admin panel: `/admin`.

## Supabase

- **Schema:** `supabase/migrations`. Starter data: `supabase/seed.sql`.
- **Security:** every table has row level security. Guests reach orders only through the
  `place_order`, `get_order` and `track_order` functions.
- **Making an admin:** register on the site, then run this in the Supabase SQL editor and
  sign in again:

  ```sql
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
  where email = 'admin-email@example.com';
  ```

- **On deploy:** `.env.production` holds the public Supabase settings. Add the live domain
  plus `/auth/callback` under Authentication, URL Configuration, and set it as the Site URL.

## Things to know

- **Prices are per kg.** `src/lib/pricing.ts` turns them into 250g, 500g and 1kg prices.
- **A price of 0** shows "Ask price on WhatsApp" and cannot be added to the cart. The admin
  dashboard counts these.
- **Logo:** `logo.jpeg` holds both logos. `public/brand/logo-title.webp` is its title half (header, footer) and `src/app/icon.png` is its SM mark (favicon). Both are plain crops. Do not redraw or recolour them.
- **Uploads** go to the `product-images` Supabase Storage bucket, so they survive redeploys.
