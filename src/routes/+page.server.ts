import { db } from "$lib/server/db";
import { tickets } from "$lib/server/schema";

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allTickets = await db.select().from(tickets).all();
    return {
        allTickets
    }
};