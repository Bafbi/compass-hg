import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getToken, type JWT } from '@auth/core/jwt';
import { Client } from '@microsoft/microsoft-graph-client';
import { AUTH_SECRET } from '$env/static/private';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!event.url.pathname.startsWith('/auth/signin') && !session?.user)
		throw redirect(303, '/auth/signin');

	const token = await getToken({ req: event.request, secret: AUTH_SECRET });
	let graphClient: Client | null = null;
	if (token !== null && token.accessToken !== undefined) {
		graphClient = Client.init({
      debugLogging: true,
			authProvider: async (done) => {
				const token = await getToken({ req: event.request });
				done(null, (token as JWT).accessToken as string);
			}
		});
	}

	return { session: session, graphClient: graphClient };
};
