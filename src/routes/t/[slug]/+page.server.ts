import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { tickets, users, type Ticket } from '$lib/server/schema';
import { compile } from 'mdsvex';
import rehypeSanitize from 'rehype-sanitize'

import type { PageServerLoad } from './$types';

export type TicketDetail = Ticket & {
	createdBy_name: string | null;
};

export const load: PageServerLoad = async ({ params }) => {
	const { slug: ticketId } = params;

	const selectTicket = await db
		.select({
			ticket: { ...tickets },
			user: {
				name: users.name
			}
		})
		.from(tickets)
		.where(eq(tickets.id, ticketId))
		.innerJoin(users, eq(tickets.createdBy, users.id))
		.get();

	const ticket = {
		...selectTicket.ticket,
		body: await compile(selectTicket.ticket.body, { rehypePlugins: [rehypeSanitize] }),
		createdBy_name: selectTicket.user.name
	};
	return {
		ticket
	};
};
