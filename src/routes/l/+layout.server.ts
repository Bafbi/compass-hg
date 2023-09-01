import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const session = (await parent()).session;
    if (!session) throw redirect(303, '/auth/signin');
    if (!session.user.is_admin) throw redirect(303, '/');
}