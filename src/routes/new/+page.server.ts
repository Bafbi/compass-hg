import { db } from '$lib/server/db';
import {
	insertTicketSchema,
	tickets,
	type InsertTicket,
	labels,
	ticketLabels,
	users,
	accounts,
	attachments,
	type InsertAttachment
} from '$lib/server/schema';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
// Import the email template as a string
// https://vitejs.dev/guide/assets.html#importing-asset-as-string
import emailTemplate from './email.template.html?raw';
import { fill_template, send_email, try_refresh_token } from '$lib/graph';

export const load: PageServerLoad = async () => {
	const allLabels = await db.select().from(labels).all();
	const allUsers = await db.select().from(users).orderBy().all();

	const form = await superValidate(insertTicketFormSchema);

	// Always return { form } in load and form actions.
	return { form, allLabels, allUsers };
};

// Zod schema for the form data validation
const insertTicketFormSchema = insertTicketSchema
	.pick({ title: true, fromService: true, body: true, notify: true })
	.extend({
		labels: z.string().array(),
		requester: z.string().optional(),
		attachments: z.any().optional()
	});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.getSession();
		// Should never happen
		if (!session?.user) return fail(403, { error: 'You must be logged in to create a ticket.' });

		const formData = await request.formData();
		// Validate form data
		const form = await superValidate(formData, insertTicketFormSchema);
		if (!form.valid) return fail(400, { form });
		// Validate attachments
		const filesData = formData.getAll('attachments');
		const files: File[] = [];
		if (filesData instanceof Array) {
			for (let i = 0; i < filesData.length; i++) {
				const file = filesData[i];
				if (file instanceof File) {
					// Limit file size to 10MB
					if (file.size > MAX_FILE_SIZE) {
						return setError(
							form,
							'attachments',
							`File '${file.name}' too big (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`
						);
					}
					files.push(file);
				}
			}
		}

		const ticketData: InsertTicket = {
			// generate an uuid
			id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			title: form.data.title,
			fromService: form.data.fromService,
			body: form.data.body,
			createdBy: session?.user.id,
			updatedBy: session?.user.id,
			status: 'En attente',
			notify: form.data.notify,
			requester:
				session.user.is_admin && form.data.requester ? form.data.requester : session?.user.id
		};

		// Insert ticket into db
		await db.insert(tickets).values(ticketData).run();
		// Link labels to ticket
		const labelsInsertPromise = form.data.labels.flatMap(async (label) => {
			db.insert(ticketLabels).values({ ticketId: ticketData.id, labelId: label }).run();
		});
		await Promise.all(labelsInsertPromise);

		// Insert attachments into db
		files.forEach(async (file) => {
			// Convert to buffer then insert into db
			const buffer = Buffer.from(await file.arrayBuffer());
			const attachmentData: InsertAttachment = {
				id:
					Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
				ticketId: ticketData.id,
				name: file.name,
				type: file.type,
				blob: buffer
			};
			await db.insert(attachments).values(attachmentData).run();
		});

		// Refresh token if needed then send email if wanted
		try_refresh_token(session?.user.id)
			.then(async (refreshed) => {
				if (refreshed) {
					console.log('Token was refreshed');
				} else {
					console.log('Token was not refreshed');
				}

				const token = (
					await db.select().from(accounts).where(eq(accounts.userId, session.user.id)).get()
				).access_token;

				// return if we don't have a token or if the user doesn't want to be notified
				if (!token || !ticketData.notify) return;
				const requesterEmail = (
					await db.select().from(users).where(eq(users.id, ticketData.requester)).get()
				).email;

				const createdTicketData = { ...ticketData, created_at: new Date().toLocaleString() };

				const email = fill_template(emailTemplate, createdTicketData);

				await send_email(token, `Nouveau ticket: ${ticketData.title}`, email, requesterEmail);
			})
			.catch((err) => {
				console.error(err);
			});

		// Redirect to the ticket page
		throw redirect(303, `/t/${ticketData.id}`);
	}
};
