// Creates or upgrades the database. Works on a fresh database and on one imported
// from the PHP site; it never deletes data.
// Run with: npm run db:setup
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { catalog, reviews } from "../db/catalog.mjs";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const connectionOptions = { multipleStatements: true, charset: "utf8mb4" };

async function connect() {
  try {
    return await mysql.createConnection({ uri: url, ...connectionOptions });
  } catch (error) {
    if (error.code !== "ER_BAD_DB_ERROR") throw error;
  }
  // First run on this server: create the database, then connect to it.
  const target = new URL(url);
  const name = decodeURIComponent(target.pathname.slice(1));
  target.pathname = "/";
  const server = await mysql.createConnection({ uri: target.toString(), ...connectionOptions });
  await server.query("CREATE DATABASE ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", [name]);
  await server.end();
  return mysql.createConnection({ uri: url, ...connectionOptions });
}

const db = await connect();

const schema = await readFile(path.resolve(import.meta.dirname, "../db/schema.sql"), "utf8");
await db.query(schema);

async function addColumn(table, column, definition) {
  const [rows] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
  if (rows.length === 0) await db.query(`ALTER TABLE \`${table}\` ADD COLUMN ${column} ${definition}`);
  return rows.length === 0;
}

await addColumn("products", "stock_status", "VARCHAR(20) DEFAULT 'Available' AFTER stock_quantity");
await addColumn("order_items", "weight", "VARCHAR(10) DEFAULT NULL AFTER quantity");
await addColumn("orders", "stock_applied", "TINYINT(1) NOT NULL DEFAULT 0");

// Orders used to be matched to accounts by phone number alone, so anyone could see
// a stranger's address by registering with their number. Existing matches are
// linked once here; new orders store the account id at checkout.
if (await addColumn("orders", "customer_id", "INT DEFAULT NULL AFTER id")) {
  await db.query("UPDATE orders o JOIN customers c ON o.phone = c.phone SET o.customer_id = c.id");
}

await db.query(
  "INSERT INTO categories (id, name) VALUES (1,'Sweets'),(2,'Namkeen'),(3,'Vrat/Fast'),(4,'Farsan') ON DUPLICATE KEY UPDATE name = VALUES(name)",
);

const [[{ total: productCount }]] = await db.query("SELECT COUNT(*) AS total FROM products");
if (productCount === 0) {
  await db.query(
    "INSERT INTO products (name, category_id, image, price, featured) VALUES ?",
    [catalog.map(([name, category, image, price, featured]) => [name, category, image, price, featured])],
  );
}

const [[{ total: reviewCount }]] = await db.query("SELECT COUNT(*) AS total FROM reviews");
if (reviewCount === 0) {
  await db.query("INSERT INTO reviews (customer_name, rating, review_text) VALUES ?", [reviews]);
}

const [[{ total: offerCount }]] = await db.query("SELECT COUNT(*) AS total FROM offers");
if (offerCount === 0) {
  await db.query(
    "INSERT INTO offers (description, discount, start_date, end_date, active) VALUES (?, 0, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1)",
    ["Bulk and festive orders available now. Contact us on WhatsApp."],
  );
}

const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM products");
console.log(`Database ready with ${total} products`);
await db.end();
