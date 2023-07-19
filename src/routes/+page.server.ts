import { db } from "$lib/server/db";
import { users } from "$lib/server/schema";

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allUsers = await db.select().from(users).all();
    return {
        allUsers
    }
};