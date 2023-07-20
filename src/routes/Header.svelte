<script>
	import { page } from '$app/stores';
</script>

<header class="bg-black flex flex-row justify-between p-4">
	<h1>
		<a href="/" class="text-white text-2xl">CompassHG</a>
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
				<a href="/auth/signin" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</a>
			{/if}
		</p>
	</div>
</header>
