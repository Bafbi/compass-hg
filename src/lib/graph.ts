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

	// console.log('account', account);
	// console.log(account.expires_at, ">", Date.now(), account.expires_at > Date.now(), account.expires_at - Date.now());

	// quit if no refresh token or expires_at is in the future
	if (!account.refresh_token || !account.expires_at || account.expires_at > Date.now()) {
		// console.log('no refresh token or expires_at is in the future');
		return false;
	}

	await fetch(
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
	)
		.then(async (res) => {
			if (res.ok) {
				const data = await res.json();
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
			}
		})
		.catch((err) => {
			throw err;
		});
	return true;
};

export const fill_template = (template: string, data: { [key: string]: any }) => {
	Object.entries(data).forEach(([key, value]) => {
		template = template.replace(`{{${key}}}`, value?.toString());
	});
	return template;
};

export const send_email = async (token: string, subject: string, body: string, to: string) => {
	await graph(token)
		.api('/me/sendMail')
		.post(
			{
				message: {
					subject,
					body: {
						contentType: 'HTML',
						content: body
					},
					toRecipients: [
						{
							emailAddress: {
								address: to
							}
						}
					]
				}
			},
			(error) => {
				if (error.statusCode === 401) {
					console.log('token expired');
				}
			}
		)
		.catch((error) => {
			throw error;
		});
};
