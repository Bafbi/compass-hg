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

	<footer class="bg-surface-variant w-full">
		<p class="text-center text-sm text-outline"><a href="https://www.holwegweber.com/">The HolwegWeber Group</a> – Sustainable solutions for daily life packaging</p>
	</footer>
</div>
