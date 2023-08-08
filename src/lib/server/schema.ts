import { sql, type InferModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users, accounts, sessions, verificationTokens } from './sqlite-nextauth-adapter';

export const serviceEnum = ['RH', 'IT'];
export const statusEnum = ['OPEN', 'CLOSED'];

const tickets = sqliteTable('tickets', {
	id: text('id').notNull().primaryKey(),
	title: text('title', { length: 200 }).notNull(),
	body: text('body').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	requester: text('requester')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	fromService: text('from_service', { enum: serviceEnum as [string, ...string[]] }).notNull(),
	status: text('status', { enum: statusEnum as [string, ...string[]] }).notNull(),
	plannedFor: integer('planned_for', { mode: 'timestamp' })
});

export const insertTicketSchema = createInsertSchema(tickets);
export type InsertTicket = InferModel<typeof tickets, 'insert'>;
export type Ticket = InferModel<typeof tickets, 'select'>;

const labels = sqliteTable('labels', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	color: text('color').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	updatedBy: text('updated_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

export const insertLabelSchema = createInsertSchema(labels);

const ticketLabels = sqliteTable('ticket_labels', {
	ticketId: text('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	labelId: text('label_id')
		.notNull()
		.references(() => labels.id, { onDelete: 'cascade' })
});

export { users, accounts, sessions, verificationTokens, tickets, labels, ticketLabels };
