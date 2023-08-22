import { db } from '$lib/server/db';
import { insertTicketSchema, tickets, type InsertTicket, labels, ticketLabels, users } from '$lib/server/schema';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({parent}) => {
	const session = (await parent()).session;
	console.log('session', session);
	
	const allLabels = await db.select().from(labels).all();
	const allUsers = await db.select().from(users).all();

	const form = await superValidate(insertTicketFormSchema);

	// Always return { form } in load and form actions.
	return { form, allLabels, allUsers };
};

const insertTicketFormSchema = insertTicketSchema.pick({ title: true, fromService: true, body: true }).extend({labels: z.string().array(), requester: z.string().optional()});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) return fail(403, { error: 'You must be logged in to create a ticket.' });
		const form = await superValidate(request, insertTicketFormSchema);
		console.log('POST', form);
		if (!form.valid) return fail(400, { form });
		const ticketData: InsertTicket = {
			// generate an uuid
			id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			title: form.data.title,
			fromService: form.data.fromService,
			body: form.data.body,
			createdBy: session?.user.id,
			updatedBy: session?.user.id,
			status: 'OPEN',
			requester: (session.user.is_admin && form.data.requester) ? form.data.requester : session?.user.id
		};
		// console.log('ticketData', ticketData);
		
		db.insert(tickets).values(ticketData).run();
		form.data.labels.forEach(label => {
			db.insert(ticketLabels).values({ticketId: ticketData.id, labelId: label}).run();
		});
		throw redirect(303, `/t/${ticketData.id}`);
	}
};
