<script lang="ts">
	import './md.css';
	import '$lib/style/prism.css'

	export let data;
	$: ticket = data.ticket;

	let raw: boolean = false;
</script>

<svelte:head>
	<title>{ticket.title} - Compass-HG</title>
	<meta name="body" content="See ticket details" />
</svelte:head>

<div
	class=" mx-auto my-4 flex w-5/6 flex-col gap-6 rounded-2xl border-2 border-secondary-container px-6 py-4"
>
	<section class="bg-surface-variant flex flex-col gap-2 rounded-xl p-2 shadow-lg">
		<h1>{ticket.title}</h1>
	</section>
	<section>
		<!-- Toolbar -->
		<div>
			<button on:click={() => raw = !raw}>
				Raw
			</button>
		</div>
		{#if raw}
		{ticket.raw}
		{:else}
		{@html ticket.body?.code}
		{/if}
	</section>
</div>
