<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import MediaQuery from './MediaQuery.svelte';
</script>

<header
	class="bg-primary-variant mx-4 flex -translate-y-2 items-center justify-between rounded-lg p-4"
>
	<a href="/" class=" flex flex-row gap-2">
		<img class=" h-8 w-8" src="/favicon-96x96.png" alt="logo" />
		<h1 class="text-2xl font-bold">Ticketing HG</h1>
	</a>
	<div class="flex items-center">
		{#if $page.data.session}
			<div class="flex items-center">
				{#if $page.data.session.user?.image}
					<div class="h-8 w-8 overflow-hidden rounded-full">
						<img src={$page.data.session.user.image} alt="Profile" />
					</div>
				{/if}
				<MediaQuery query="(min-width: 600px)" let:matches>
					{#if matches}
						<span class=" ml-2" title={$page.data.session.user?.email}>
							<strong>{$page.data.session.user?.name ?? $page.data.session.user?.email}</strong>
						</span>
					{/if}
				</MediaQuery>
				<a href="/auth/signout" class="ml-4"
					><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5V5z"
						/><path
							fill="currentColor"
							d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z"
						/></svg
					></a
				>
			</div>
		{/if}
	</div>
</header>
