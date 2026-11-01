import "server-only";
import mysql, { type PoolConnection, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

const globalForPool = globalThis as unknown as { pool?: mysql.Pool };

function getPool() {
  if (!globalForPool.pool) {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error("DATABASE_URL is not set");
    globalForPool.pool = mysql.createPool({
      uri,
      connectionLimit: 10,
      charset: "utf8mb4",
      decimalNumbers: true,
      dateStrings: true,
    });
  }
  return globalForPool.pool;
}

type Params = (string | number | null)[];

export async function query<T>(sql: string, params: Params = []) {
  const [rows] = await getPool().query<RowDataPacket[]>(sql, params);
  return rows as T[];
}

export async function execute(sql: string, params: Params = []) {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}

export async function transaction<T>(work: (tx: PoolConnection) => Promise<T>) {
  const tx = await getPool().getConnection();
  try {
    await tx.beginTransaction();
    const result = await work(tx);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.release();
  }
}
