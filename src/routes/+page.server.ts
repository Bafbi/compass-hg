import { db } from '$lib/server/db';
import { eq, sql, and, like, inArray, asc, desc } from 'drizzle-orm';
import { tickets, users, type Ticket, labels, ticketLabels, type Label } from '$lib/server/schema';

import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { parseQueryString } from '$lib/filter';

export type TicketPreview = Ticket & {
	requester_name: string | null;
	labels: Label[];
};

export const load: PageServerLoad = async ({ url, parent }) => {
	// Should never happen
	const session = (await parent()).session;
	if (!session) throw redirect(303, '/auth/signin');

	const filters = parseQueryString(url.searchParams.get('q') || '');

	const date = new Date('2099-12-31');

	const allTickets = await db
		.select({
			ticket: { ...tickets },
			user: { name: users.name },
			labels: sql<string | null>`group_concat(${ticketLabels.labelId}, ',')`
		})
		.from(tickets)
		.where(
			and(
				session.user.is_admin
					? filters.requester
						? like(users.email, `%${filters.requester}%`)
						: sql`1=1`
					: eq(tickets.requester, session.user.id),
				filters.service ? eq(tickets.fromService, filters.service) : sql`1=1`,
				filters.status ? eq(tickets.status, filters.status) : sql`1=1`,
				filters.labels.length !== 0 ? inArray(ticketLabels.labelId, filters.labels) : sql`1=1`,
				filters.search ? like(tickets.title, `%${filters.search.join('%')}%`) : sql`1=1`
			)
		)
		.innerJoin(users, eq(tickets.requester, users.id))
		.leftJoin(ticketLabels, eq(tickets.id, ticketLabels.ticketId))
		.groupBy(tickets.id)
		.having(
			filters.labels.length !== 0
				? sql`count(${ticketLabels.labelId}) = ${filters.labels.length}`
				: sql`1=1`
		)
		// I want to order by plannedFor asc but if is NULL I want to order by createdAt desc
		.orderBy(
			sql`case when ${tickets.plannedFor} is null then 1 else 0 end`,
			tickets.plannedFor,
			desc(tickets.createdAt)
		)
		.all();
	// console.log(allTickets);

	// Get all labels for each ticket, possibly a better way to use the labels field on `AllTickets` but I couldn't figure out how to get all labels for each ticket
	const ticketsLabels = await db
		.select({
			ticketId: ticketLabels.ticketId,
			label: { ...labels }
		})
		.from(ticketLabels)
		.innerJoin(labels, eq(ticketLabels.labelId, labels.id))
		.all();

	// Concatenate all labels for each ticket
	const allTicketsPreview: TicketPreview[] = allTickets.map((ticket) => {
		const labels = ticketsLabels
			.filter((label) => label.ticketId === ticket.ticket.id)
			.map((label) => label.label);
		return {
			...ticket.ticket,
			requester_name: ticket.user.name,
			labels: labels
		};
	});

	const allLabels = await db.select().from(labels).all();

	return {
		allTicketsPreview,
		allLabels,
		filters
	};
};
