import type { PageServerLoad } from "./$types";
import { labels } from "$lib/server/schema";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async () => {
    const allLabels = await db.select().from(labels).all();

    return { allLabels };
}