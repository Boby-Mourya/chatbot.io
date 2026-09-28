import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const { Pool } = pg;
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function migrate() {
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, 'schema.sql');
  const sql = await readFile(path, 'utf8');
  await pool.query(sql);
}

export async function one<T>(text: string, values: unknown[] = []): Promise<T | undefined> {
  const result = await pool.query(text, values);
  return result.rows[0] as T | undefined;
}
export async function many<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const result = await pool.query(text, values);
  return result.rows as T[];
}
