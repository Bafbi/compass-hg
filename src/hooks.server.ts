import { SvelteKitAuth } from "@auth/sveltekit";
import AzureAd from "@auth/core/providers/azure-ad";
import { AZUREAD_CLIENT_ID, AZUREAD_CLIENT_SECRET, AZUREAD_TENANT_ID } from "$env/static/private";
import { SQLiteDrizzleAdapter } from "$lib/server/sqlite-nextauth-adapter";
import { db } from "$lib/server/db";
import type { DefaultSession, User } from "@auth/core/types";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      is_admin: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "@auth/core/types" {
  interface User {
    is_admin: boolean; 
    // ...other properties
    // role: UserRole;
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    accessToken: string | undefined
    // ...other properties
    // role: UserRole;
  }
}

export const handle = SvelteKitAuth({
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        is_admin: user.is_admin,
      },
    }),
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token
    },
  },
  adapter: SQLiteDrizzleAdapter(db),
  providers: [AzureAd({ clientId: AZUREAD_CLIENT_ID, clientSecret: AZUREAD_CLIENT_SECRET, tenantId: AZUREAD_TENANT_ID, allowDangerousEmailAccountLinking: true})],
});