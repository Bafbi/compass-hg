import { db } from '$lib/server/db';
import { eq, sql, and, like, inArray } from 'drizzle-orm';
import {
	tickets,
	users,
	type Ticket,
	labels,
	ticketLabels,
	type Label
} from '$lib/server/schema';

import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { parseQueryString } from '$lib/filter';

export type TicketPreview = Ticket & {
	requester_name: string | null;
	labels: Label[];
};

export const load: PageServerLoad = async ({ url, parent }) => {
	const session = (await parent()).session;
	if (!session) throw redirect(303, '/auth/signin');
	if (!session.user) throw redirect(303, '/auth/signin');

	// console.log(session);

	const filters = parseQueryString(url.searchParams.get('q') || '');
	console.log(filters);

// 	SELECT
//     t.*,
//     GROUP_CONCAT(DISTINCT l.name) AS matching_labels
// FROM tickets AS t
// JOIN (
//     SELECT
//         tl.ticket_id
//     FROM ticket_labels AS tl
//     JOIN labels AS l ON tl.label_id = l.id
//     WHERE l.name IN ('label1', 'label2', 'label3')
//     GROUP BY tl.ticket_id
//     HAVING COUNT(DISTINCT l.name) = 3
// ) AS matching_tickets ON t.id = matching_tickets.ticket_id
// LEFT JOIN ticket_labels AS tl ON t.id = tl.ticket_id
// LEFT JOIN labels AS l ON tl.label_id = l.id
// GROUP BY t.id;

	const allTickets = await db
		.select({
			ticket: { ...tickets },
			user: { name: users.name },
			labels : sql<string | null>`group_concat(${ticketLabels.labelId}, ',')`
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
				filters.search ? like(tickets.title, `%${filters.search.join("%")}%`) : sql`1=1`
			)
		)
		.innerJoin(users, eq(tickets.requester, users.id))
		.leftJoin(ticketLabels, eq(tickets.id, ticketLabels.ticketId))
		.groupBy(tickets.id)
		.having(filters.labels.length !== 0 ? sql`count(${ticketLabels.labelId}) = ${filters.labels.length}`: sql`1=1`)
		.orderBy(tickets.createdAt)
		.all();

	// console.log(allTickets);
	

	const ticketsLabels = await db
		.select({
			ticketId: ticketLabels.ticketId,
			label: { ...labels }
		})
		.from(ticketLabels)
		.innerJoin(labels, eq(ticketLabels.labelId, labels.id))
		.all();

	//   console.log(ticketsLabels);

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

	// console.log(allTicketsPreview);

	const allLabels = await db.select().from(labels).all();

	// const allTicketsPreview: TicketPreview[] = allTickets.map((ticket) => {
	// 	const labels = ticket.labels?.split(',').map(label => allLabels.find(l => l.id === label)).filter(l => l !== undefined) as Label[];
	// 	return {
	// 		...ticket.ticket,
	// 		requester_name: ticket.user.name,
	// 		labels: labels || []
	// 	};
	// });


	return {
		allTicketsPreview,
		allLabels,
		filters
	};
};
