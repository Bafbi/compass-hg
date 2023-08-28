import { Client } from '@microsoft/microsoft-graph-client';
import { db } from './server/db';
import { eq } from 'drizzle-orm';
import { accounts } from './server/schema';
import { AZUREAD_CLIENT_ID, AZUREAD_CLIENT_SECRET, AZUREAD_TENANT_ID } from '$env/static/private';

const globalForGraph = globalThis as unknown as {
	client: Client | undefined;
};

export const graph = (token: string) => {
	if (globalForGraph.client) return globalForGraph.client;
	globalForGraph.client = Client.init({
		debugLogging: true,
		authProvider: async (done) => {
			done(null, token);
		}
	});
	return globalForGraph.client;
};

export const try_refresh_token = async (userId: string): Promise<boolean> => {
	const account = await db
		.select({ refresh_token: accounts.refresh_token, expires_at: accounts.expires_at })
		.from(accounts)
		.where(eq(accounts.userId, userId))
		.get();

    console.log('account', account);
    console.log(account.expires_at, ">", Date.now(), account.expires_at > Date.now(), account.expires_at - Date.now());
    

	// quit if no refresh token or expires_at is in the future
	if (!account.refresh_token || !account.expires_at || account.expires_at > Date.now()) {
        console.log('no refresh token or expires_at is in the future');
        
        return false;
    } 

    console.log('fetch');
    
	fetch(
		'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token'.replace(
			'{tenant}',
			AZUREAD_TENANT_ID
		),
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: AZUREAD_CLIENT_ID,
				client_secret: AZUREAD_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: account.refresh_token
			})
		}
	).then(async (res) => {
        console.log('res', res);
        if (res.ok) {
            const data = await res.json();
            console.log('data', data);
            await db
                .update(accounts)
                .set({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_at: Date.now() + data.expires_in * 1000,
                    id_token: data.id_token
                })
                .where(eq(accounts.userId, userId))
                .run();
            return true;
        }
    }).catch((err) => {
        console.error(err);
        return false;
    });
    return false;
};
