import { type Config } from 'drizzle-kit';

export default {
	out: 'drizzle',
	schema: 'src/lib/server/schema.ts',
	breakpoints: true,
    driver: 'turso'
} satisfies Config;