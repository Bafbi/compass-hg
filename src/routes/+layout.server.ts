import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Verify that the user is logged in
	const session = await event.locals.getSession();
	if (!event.url.pathname.startsWith('/auth') && !session?.user)
		throw redirect(303, '/auth/signin');

	return { session: session };
};
