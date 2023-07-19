import { type Config } from 'drizzle-kit';

export default {
	out: 'drizzle',
	schema: 'src/lib/server/schema.ts',
	breakpoints: true,
  driver: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL || "ws://127.0.0.1:8080",
	}
} satisfies Config;