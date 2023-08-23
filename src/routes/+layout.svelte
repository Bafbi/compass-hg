<script>
	import Header from './Header.svelte';
	import "../app.css";
</script>

<div class="flex flex-col min-h-screen w-full bg-background overflow-y-hidden">
	<Header />

	<main class="flex-1">
		<slot />
	</main>

	<footer class="bg-tertiary w-full">
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit </p>
	</footer>
</div>