import { db } from '$lib/server/db';
import { eq, inArray, sql, and, like } from 'drizzle-orm';
import {
	tickets,
	users,
	type Ticket,
	labels,
	serviceEnum,
	statusEnum,
	type Service,
	type Status,
	isEnumValue
} from '$lib/server/schema';

import type { PageServerLoad } from './$types';

export type TicketPreview = Ticket & {
	requester_name: string | null;
};

export type TicketsFilters = {
	query: string;
	service?: Service;
	status?: Status[];
	labels?: string[];
	requester?: string;
	search?: string;
};

const enum QueryType {
	label,
	is,
	from,
	requester
}

export const load: PageServerLoad = async ({ url, parent }) => {
    const session = (await parent()).session;
    if (!session) {
        return {
            status: 401,
            error: 'Unauthorized'
        }
    }


	const filters: TicketsFilters = url.searchParams.get('q')
		? url.searchParams
				.get('q')!
				.split(' ')
				.reduce(
					(acc, query) => {
						const [type, value] = query.split(':');
						switch (type) {
							case 'is':
								if (isEnumValue(statusEnum, value)) {
									acc.status = [...(acc.status || []), value];
								}
								break;
							case 'label':
								acc.labels = [...(acc.labels || []), value];
								break;
							case 'from':
								if (isEnumValue(serviceEnum, value)) {
									acc.service = value;
								}
								break;
							case 'requester':
								acc.requester = value;
								break;
							case 'search':
								acc.search = value;
								break;
						}
						return acc;
					},
					{ query: url.searchParams.get('q') } as TicketsFilters
				)
		: { query: '' };

    console.log(filters);
    

	const selectAllTickets = await db
		.select({
			ticket: { ...tickets },
			user: {
				name: users.name
			}
		})
		.from(tickets)
		.where(
			and(
                session.user.is_admin ? filters.requester ? like(users.email, `%${filters.requester}%`) : sql`1=1` : eq(tickets.requester, session.user.id),
				filters.service ? eq(tickets.fromService, filters.service) : sql`1=1`,
				filters.status ? inArray(tickets.status, filters.status) : sql`1=1`,
			)
		)
		.innerJoin(users, eq(tickets.requester, users.id))
		.all();

	const allLabels = await db.select().from(labels).all();

	const allTickets: TicketPreview[] = selectAllTickets.map((ticket) => {
		return {
			...ticket.ticket,
			requester_name: ticket.user.name
		};
	});

    // console.log(allTickets);
    
	return {
		allTickets,
		allLabels,
		serviceEnum,
		statusEnum,
		filters
	};
};
