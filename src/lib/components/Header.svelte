<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from "@auth/sveltekit/client"
</script>

<header class="bg-primary-variant flex justify-between items-center p-4 rounded-lg mx-4 -translate-y-2">
    <h1>
        <a href="/" class="text-2xl font-bold">CompassHG</a>
    </h1>
    <div class="flex items-center">
        {#if $page.data.session}
            <div class="flex items-center">
                {#if $page.data.session.user?.image}
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <img src={$page.data.session.user.image} alt="Profile">
                    </div>
                {/if}
                <span class=" ml-2" title={$page.data.session.user?.email}>
                    <strong>{$page.data.session.user?.name ?? $page.data.session.user?.email}</strong>
                </span>
                <a href="/auth/signout" class="ml-4 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5V5z"/><path fill="currentColor" d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z"/></svg></a>
            </div>
        {/if}
    </div>
</header>

