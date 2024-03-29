import { SvelteKitAuth } from '@auth/sveltekit';
import AzureAd from '@auth/core/providers/azure-ad';
import {
	AZUREAD_CLIENT_ID,
	AZUREAD_CLIENT_SECRET,
	AZUREAD_TENANT_ID,
	AUTH_SECRET
} from '$env/static/private';
import { db } from '$lib/server/db';
import { SQLiteDrizzleAdapter } from '$lib/server/sqlite-nextauth-adapter';
import { accounts } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			is_admin: boolean;
		} & DefaultSession['user'];
	}

	interface User {
		is_admin: boolean;
	}
}

declare module '@auth/core/jwt' {
	interface JWT extends DefaultJWT {
		accessToken: string | undefined;
	}
}

export const handle = SvelteKitAuth({
	/**
	 * @see https://next-auth.js.org/configuration/callbacks
	 */
	callbacks: {
		session: async ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
				is_admin: user.is_admin
			}
		}),
		/**
		 * We update the user's account in database with the new tokens.
		 *
		 * @see https://learn.microsoft.com/en-us/graph/auth-v2-user?tabs=http
		 */
		async signIn({ account }) {
			if (!account) return true;
			// console.log('signIn', account);

			const rawAccount = {
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				refresh_token: account.refresh_token,
				access_token: account.access_token,
				expires_at: account.expires_at,
				token_type: account.token_type,
				scope: account.scope,
				id_token: account.id_token,
				session_state: account.session_state?.toString()
			};
			// console.log('rawAccount', rawAccount);
			await db
				.update(accounts)
				.set(rawAccount)
				.where(eq(accounts.providerAccountId, account.providerAccountId))
				.run();

			return true;
		}
	},
	adapter: SQLiteDrizzleAdapter(db),
	providers: [
		AzureAd({
			clientId: AZUREAD_CLIENT_ID,
			clientSecret: AZUREAD_CLIENT_SECRET,
			tenantId: AZUREAD_TENANT_ID,
			authorization: {
				params: {
					scope: 'openid profile email offline_access user.read user.readbasic.all mail.send'
				}
			}
		})
	],
	secret: AUTH_SECRET,
	debug: false
});
