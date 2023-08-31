import { persisted } from 'svelte-local-storage-store';

export const lastViewed = persisted('lastViewed', {} as Record<string, string>);
