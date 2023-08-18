import { db } from '$lib/server/db';
import { eq, inArray, sql, and, like, desc } from 'drizzle-orm';
import {
	tickets,
	users,
	type Ticket,
	labels,
	serviceEnum,
	statusEnum,
	type Service,
	type Status,
	isEnumValue,
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

// export type TicketsFilters = {
// 	query: string;
// 	service?: Service;
// 	status?: Status[];
// 	labels?: string[];
// 	requester?: string;
// 	search?: string;
// };

export const load: PageServerLoad = async ({ url, parent }) => {
	const session = (await parent()).session;
	if (!session) throw redirect(303, '/auth/signin');
	if (!session.user) throw redirect(303, '/auth/signin');

	// console.log(session);

	const filters = parseQueryString(url.searchParams.get('q') || '');
	console.log(filters);

const allTickets = await db
  .select({
    ticket: { ...tickets },
    user: { name: users.name },
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
      filters.status ? inArray(tickets.status, filters.status) : sql`1=1`
    )
  )
  .innerJoin(users, eq(tickets.requester, users.id))
  .groupBy(tickets.id, users.name)
  .all();

const ticketsLabels = await db
  .select({
    ticketId: ticketLabels.ticketId,
    label: {...labels},
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
    labels: labels,
  };
});

	// console.log(allTicketsPreview);


	const allLabels = await db.select().from(labels).all();

	return {
		allTicketsPreview,
		allLabels,
		serviceEnum,
		statusEnum,
		filters
	};
};
