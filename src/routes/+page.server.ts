import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { tickets, users, type Ticket } from '$lib/server/schema';

import type { PageServerLoad } from './$types';

export type TicketPreview = Ticket & {
        createdBy_name: string | null;
}

export const load: PageServerLoad = async () => {
	const selectAllTickets = await db
		.select({
            ticket: {...tickets},
            user: {
                name: users.name
            }
        })
		.from(tickets)
		.innerJoin(users, eq(tickets.createdBy, users.id))
		.all();

    const allTickets: TicketPreview[] = selectAllTickets.map((ticket) => {
        return {
            ...ticket.ticket,
            createdBy_name: ticket.user.name
        }
    });
	return {
		allTickets
	};
};
