<script>
	import { Toasts, toast } from 'svoast';
	import Header from '../lib/components/Header.svelte';
	import '../app.css';
</script>

<Toasts position="top-right" />

<div class="bg-background flex min-h-screen w-full flex-col overflow-y-hidden">
	<Header />

	<main class="flex flex-1">
		<slot />
	</main>

	<footer class="bg-tertiary w-full">
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>
