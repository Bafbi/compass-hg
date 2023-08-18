import { sql, type InferModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { serviceEnum, statusEnum } from '../const';

const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
	is_admin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
});

const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);



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
	fromService: text('from_service', { enum: serviceEnum }).notNull(),
	status: text('status', { enum: statusEnum }).notNull(),
	plannedFor: integer('planned_for', { mode: 'timestamp' })
});

export const insertTicketSchema = createInsertSchema(tickets);
export type InsertTicket = InferModel<typeof tickets, 'insert'>;
export type Ticket = InferModel<typeof tickets, 'select'>;

const labels = sqliteTable('labels', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	color: integer("color").notNull(),
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
export type InsertLabel = InferModel<typeof labels, 'insert'>;
export type Label = InferModel<typeof labels, 'select'>;

const ticketLabels = sqliteTable('ticket_labels', {
	ticketId: text('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	labelId: text('label_id')
		.notNull()
		.references(() => labels.id, { onDelete: 'cascade' })
});

export { users, accounts, sessions, verificationTokens, tickets, labels, ticketLabels };
