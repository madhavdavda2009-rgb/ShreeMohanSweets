# Shree Mohan Sweets and Namkeen

Next.js 16 storefront and admin panel, migrated from the shop's earlier PHP site.

## Run locally

Requires Node 20+ and MySQL 8 (WAMP's MySQL works).

```bash
npm install
```

```bash
copy .env.example .env.local
```

Fill in `.env.local`. Then create or upgrade the database, build, and start:

```bash
npm run db:setup
```

```bash
npm run build
```

```bash
npm start
```

Use `npm run dev` while developing. Admin panel: `/admin`.

## Moving from the PHP site

1. Export the live MySQL database and import it into a new database.
2. Point `DATABASE_URL` at it and run `npm run db:setup`. It adds the new columns, links
   existing orders to accounts, and never deletes data.
3. Customer passwords carry over.
4. To bring across images uploaded through the old admin, copy them into
   `assets-src/products` and run `npm run images`.

Old `.php` addresses redirect to the new pages (see `next.config.ts`).

## Things to know

- **Prices are per kg.** `src/lib/pricing.ts` turns them into 250g, 500g and 1kg prices.
- **A price of 0** shows "Ask price on WhatsApp" and cannot be added to the cart. The admin
  dashboard counts these.
- **Admin password:** generate with `npm run admin:hash -- "your-password"` and store the
  output in `ADMIN_PASSWORD_HASH`.
- **Logo:** `logo.jpeg` holds both logos. `public/brand/logo-title.webp` is its title half (header, footer) and `src/app/icon.png` is its SM mark (favicon). Both are plain crops. Do not redraw or recolour them.
- **Uploads** are stored in `UPLOAD_DIR`, which must survive redeploys. That means a VPS or a
  Node host with a persistent disk. Serverless hosts such as Vercel need object storage first.
