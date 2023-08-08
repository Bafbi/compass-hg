<script>
	import Header from './Header.svelte';
	import "../app.css";
</script>

<div class="flex flex-col min-h-screen w-screen bg-background">
	<Header />

	<main class="flex-1">
		<slot />
	</main>

	<footer class="bottom-0 bg-tertiary">
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit </p>
	</footer>
</div>