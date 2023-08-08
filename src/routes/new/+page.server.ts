import { db } from '$lib/server/db';
import { insertTicketSchema, tickets, type InsertTicket, serviceEnum } from '$lib/server/schema';
import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({parent}) => {
	const session = (await parent()).session;
	console.log('session', session);
	

	const form = await (session?.user.is_admin ? superValidate(insertTicketFormAdminSchema) : superValidate(insertTicketFormSchema));

	// Always return { form } in load and form actions.
	return { form, serviceEnum };
};

const insertTicketFormSchema = insertTicketSchema.pick({ title: true, fromService: true, body: true });
const insertTicketFormAdminSchema = insertTicketSchema.pick({ title: true, fromService: true, body: true, requester: true });

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
			...form.data,
			createdBy: session?.user.id,
			updatedBy: session?.user.id,
			status: 'OPEN',
			requester: session?.user.id
		};
		db.insert(tickets).values(ticketData).run();
		throw redirect(303, `/t/${ticketData.id}`);
	}
};
