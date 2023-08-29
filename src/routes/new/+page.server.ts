import { db } from '$lib/server/db';
import {
	insertTicketSchema,
	tickets,
	type InsertTicket,
	labels,
	ticketLabels,
	users,
	accounts
} from '$lib/server/schema';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import emailTemplate from './email.template.html?raw';
import { graph, try_refresh_token } from '$lib/graph';

export const load: PageServerLoad = async () => {
	const allLabels = await db.select().from(labels).all();
	const allUsers = await db.select().from(users).all();

	const form = await superValidate(insertTicketFormSchema);

	// Always return { form } in load and form actions.
	return { form, allLabels, allUsers };
};

const insertTicketFormSchema = insertTicketSchema
	.pick({ title: true, fromService: true, body: true, notify: true })
	.extend({ labels: z.string().array(), requester: z.string().optional() });

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
			notify: form.data.notify,
			requester:
				session.user.is_admin && form.data.requester ? form.data.requester : session?.user.id
		};
		// console.log('ticketData', ticketData);

		await db.insert(tickets).values(ticketData).run();
		form.data.labels.forEach((label) => {
			db.insert(ticketLabels).values({ ticketId: ticketData.id, labelId: label }).run();
		});

		const new_token = await try_refresh_token(session?.user.id);
		console.log('new', new_token);

		const token = (
			await db.select().from(accounts).where(eq(accounts.userId, session?.user.id)).get()
		).access_token;
		
		if (token && ticketData.notify) {
			const requesterEmail = (
				await db.select().from(users).where(eq(users.id, ticketData.requester)).get()
			).email;
			console.log('requesterEmail', requesterEmail);

			const createdTicketData = { ...ticketData, created_at: new Date().toLocaleString() };

			// replace placeholders in email template
			Object.entries(createdTicketData).forEach(([key, value]) => {
				console.log(`{{${key}}}`, value?.toString() || '');
				
				emailTemplate.replace(`{{${key}}}`, value?.toString() || '');
			});

			// console.log('email', emailTemplate);
			

			await graph(token)
				.api('/me/sendMail')
				.post({
					message: {
						subject: 'New Ticket',
						body: {
							contentType: 'HTML',
							content: emailTemplate
						},
						toRecipients: [
							{
								emailAddress: {
									address: requesterEmail
								}
							}
						]
					}
				}, (error, response) => {
					if (error.statusCode === 401) {
						console.log('token expired');
					}
					// console.log("just try to send mail", error, response);
				}
					).catch((error) => {
						console.log(error);
					});
		}
		throw redirect(303, `/t/${ticketData.id}`);
	}
};
 