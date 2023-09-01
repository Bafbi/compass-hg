import { db } from '$lib/server/db';
import { insertLabelSchema, labels } from '$lib/server/schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const label_id = params.slug;
	const label = await db.select().from(labels).where(eq(labels.id, label_id)).get();

	const form = await superValidate(label, updateLabelFromSchema);

	return {
		form
	};
};

const updateLabelFromSchema = insertLabelSchema.pick({
	color: true,
	description: true,
	public: true
});

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) return fail(403, { error: 'You must be logged in to create a ticket.' });

		const label_id = params.slug;
		const form = await superValidate(request, updateLabelFromSchema);
		if (!form.valid) return { form };

		await db
			.update(labels)
			.set({ ...form.data, updatedBy: session.user.id, updatedAt: new Date() })
			.where(eq(labels.id, label_id))
			.run();
	},

	remove: async ({ params }) => {
		const label_id = params.slug;
		await db.delete(labels).where(eq(labels.id, label_id)).run();
	}
};
