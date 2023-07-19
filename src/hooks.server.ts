import { SvelteKitAuth } from "@auth/sveltekit";
import AzureAd from "@auth/core/providers/azure-ad";
import { AZUREAD_CLIENT_ID, AZUREAD_CLIENT_SECRET, AZUREAD_TENANT_ID } from "$env/static/private";

export const handle = SvelteKitAuth({
  providers: [AzureAd({ clientId: AZUREAD_CLIENT_ID, clientSecret: AZUREAD_CLIENT_SECRET, tenantId: AZUREAD_TENANT_ID })],
});