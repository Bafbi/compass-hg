import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users, accounts, sessions, verificationTokens } from './sqlite-nextauth-adapter';

const tickets = sqliteTable('tickets', {
	id: text('id').notNull().primaryKey(),
	title: text('title').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	requester: text('requester')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	fromService: text('from_service', { enum: ['RH', 'IT'] }).notNull(),
	status: text('status', { enum: ['OPEN', 'CLOSED'] }).notNull(),
	plannedFor: integer('planned_for', { mode: 'timestamp' }),
});

const labels = sqliteTable('labels', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	color: text('color').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});


export { users, accounts, sessions, verificationTokens, tickets, labels };
