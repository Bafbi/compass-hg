<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from "@auth/sveltekit/client"
</script>

<header class="bg-surface-variant flex flex-row justify-between p-4 rounded-lg mx-4 -translate-y-2">
	<h1>
		<a href="/" class="text-2xl">CompassHG</a>
	</h1>
	<div class="">
		<p class="">
			{#if $page.data.session}
				{#if $page.data.session.user?.image}
					<span style="background-image: url('{$page.data.session.user.image}')" class="" />
				{/if}
				<span class="">
					<strong>{$page.data.session.user?.name ?? $page.data.session.user?.email}</strong>
				</span>
				<a href="/auth/signout" class="button" data-sveltekit-preload-data="off">Sign out</a>
			{:else}
				<span class="">You are not signed in</span>
				<button on:click={() => signIn("azure-ad")} class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</button>
			{/if}
		</p>
	</div>
</header>
