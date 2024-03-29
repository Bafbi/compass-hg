import { db } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import {
	tickets,
	users,
	insertTicketSchema,
	ticketLabels,
	labels,
	attachments
} from '$lib/server/schema';
import { compile } from 'mdsvex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

// Can't be html
import emailTemplate from './transfert-email.template.txt?raw';
import { fill_template } from '$lib/graph';
import dayjs from 'dayjs';

export const load: PageServerLoad = async ({ params }) => {
	const { slug: ticketId } = params;

	const selectTicket = await db
		.select({
			ticket: { ...tickets },
			user: {
				name: users.name
			},
			labels: sql<string | null>`group_concat(${ticketLabels.labelId}, ',')`
		})
		.from(tickets)
		.where(eq(tickets.id, ticketId))
		.innerJoin(users, eq(tickets.createdBy, users.id))
		.leftJoin(ticketLabels, eq(tickets.id, ticketLabels.ticketId))
		.get();

	// console.log(selectTicket);

	const selectAttachments = await db
		.select({ id: attachments.id, name: attachments.name })
		.from(attachments)
		.where(eq(attachments.ticketId, ticketId))
		.all();

	const ticket = {
		...selectTicket.ticket,
		raw: selectTicket.ticket.body,
		// We need to compile the markdown to html and sanitize it to avoid xss
		body: await compile(selectTicket.ticket.body, {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			remarkPlugins: [[remarkBreaks]],
			rehypePlugins: [
				[
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					rehypeSanitize,
					{
						...defaultSchema,
						tagNames: [...(defaultSchema.tagNames ?? []), 'details']
					}
				]
			]
		}),
		createdBy_name: selectTicket.user.name,
		labels: selectTicket.labels?.split(',').map((label) => label.trim()) ?? [],
		attachments: selectAttachments,
		// Html don"t work with mail links
		transfertEmail: fill_template(emailTemplate, selectTicket.ticket)
	};

	const allLabels = await db.select().from(labels).all();

	const updateStatusForm = await superValidate(ticket, updateStatusFormSchema);
	const updateServiceForm = await superValidate(ticket, updateServiceFormSchema);
	const updateNotifyForm = await superValidate(ticket, updateNotifyFormSchema);
	const updateLabelForm = await superValidate(ticket, updateLabelFormSchema);
	const updatePlannedForm = await superValidate(ticket, updatePlannedFormSchema);

	return {
		ticket,
		allLabels,
		updateStatusForm,
		updateServiceForm,
		updateNotifyForm,
		updateLabelForm,
		updatePlannedForm
	};
};

const updateStatusFormSchema = insertTicketSchema.pick({ status: true });
const updateServiceFormSchema = insertTicketSchema.pick({ fromService: true });
const updateNotifyFormSchema = insertTicketSchema.pick({ notify: true });
const updateLabelFormSchema = z.object({ labels: z.string().array() });
const updatePlannedFormSchema = insertTicketSchema.pick({ plannedFor: true });

export const actions: Actions = {
	status: async ({ request, params, locals }) => {
		const { slug: ticketId } = params;
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/auth/signin');
		if (!session.user.is_admin)
			return fail(403, { error: 'You must be an admin to update the status of a ticket.' });
		const form = await superValidate(request, updateStatusFormSchema);
		if (!form.valid) return fail(400, { updateStatusForm: form });
		await db
			.update(tickets)
			.set({ status: form.data.status, updatedBy: session.user.id, updatedAt: dayjs().toDate() })
			.where(eq(tickets.id, ticketId))
			.run();
	},

	service: async ({ request, params, locals }) => {
		const { slug: ticketId } = params;
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/auth/signin');
		if (!session.user.is_admin)
			return fail(403, { error: 'You must be an admin to update the service of a ticket.' });
		const form = await superValidate(request, updateServiceFormSchema);

		if (!form.valid) return fail(400, { updateServiceForm: form });

		await db
			.update(tickets)
			.set({
				fromService: form.data.fromService,
				updatedBy: session.user.id,
				updatedAt: dayjs().toDate()
			})
			.where(eq(tickets.id, ticketId))
			.run();
	},

	label: async ({ request, params, locals }) => {
		const { slug: ticketId } = params;
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/auth/signin');
		if (!session.user.is_admin)
			return fail(403, { error: 'You must be an admin to update the labels of a ticket.' });
		const form = await superValidate(request, updateLabelFormSchema);
		if (!form.valid) return fail(400, { updateLabelForm: form });
		// console.log(form);

		await db.delete(ticketLabels).where(eq(ticketLabels.ticketId, ticketId)).run();

		// create an array of insert values
		const insertLabels = form.data.labels.flatMap((label) => ({
			labelId: label,
			ticketId: ticketId
		}));

		await db.insert(ticketLabels).values(insertLabels).run();
	},

	notify: async ({ request, params, locals }) => {
		const { slug: ticketId } = params;
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/auth/signin');
		const form = await superValidate(request, updateNotifyFormSchema);
		if (!form.valid) return fail(400, { updateNotifyForm: form });
		await db
			.update(tickets)
			.set({ notify: form.data.notify })
			.where(eq(tickets.id, ticketId))
			.run();
	},

	planned: async ({ request, params, locals }) => {
		const { slug: ticketId } = params;
		const session = await locals.getSession();
		if (!session?.user) throw redirect(303, '/auth/signin');
		if (!session.user.is_admin)
			return fail(403, { error: 'You must be an admin to update the planned date of a ticket.' });
		const form = await superValidate(request, updatePlannedFormSchema);
		if (!form.valid) return fail(400, { updatePlannedForm: form });
		await db
			.update(tickets)
			.set({
				plannedFor: form.data.plannedFor,
				updatedBy: session.user.id,
				updatedAt: dayjs().toDate()
			})
			.where(eq(tickets.id, ticketId))
			.run();
	}
};
