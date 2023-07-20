import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users, accounts, sessions, verificationTokens } from './sqlite-nextauth-adapter';

export { users, accounts, sessions, verificationTokens };

export const tickets = sqliteTable('tickets', {
	id: text('id').notNull().primaryKey(),
	title: text('title'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	requester: text('requester')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	fromService: text('from_service', { enum: ['RH', 'IT'] }).notNull()
});

export const labels = sqliteTable('labels', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	color: text('color').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});


