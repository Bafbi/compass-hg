import { insertLabelSchema, type InsertLabel, labels } from "$lib/server/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async () => {

    const form = await superValidate(insertLabelForSchema);

    return {form};
}

const insertLabelForSchema = insertLabelSchema.pick({name: true, color: true, description: true, public: true});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.getSession();
		// Should never happen
		if (!session?.user) return fail(403, { error: 'You must be logged in to create a ticket.' });

		const form = await superValidate(request, insertLabelForSchema);
        if (!form.valid) return fail(400, { form });

        const labelData: InsertLabel = {
            ...form.data,
            id: form.data.name.toLowerCase().replace(/ /g, '-'),
            createdBy: session.user.id,
            updatedBy: session.user.id
        }

        await db.insert(labels).values(labelData).run();

        throw redirect(303, '/l');
    }
}