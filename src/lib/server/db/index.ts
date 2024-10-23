import { drizzle } from 'drizzle-orm/mysql2';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle(DATABASE_URL);
