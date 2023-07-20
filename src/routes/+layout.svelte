<script>
	import Header from './Header.svelte';
	import "../app.css";
</script>

<div class="flex flex-col h-screen">
	<Header />

	<main>
		<slot />
	</main>

	<footer class="bottom-0 ">
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>