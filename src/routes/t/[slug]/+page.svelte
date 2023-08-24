<script lang="ts">
	import '$lib/style/md.css';
	import '$lib/style/prism.css';

	export let data;
	$: ticket = data.ticket;

	let raw: boolean = false;
</script>

<svelte:head>
	<title>{ticket.title} - Compass-HG</title>
	<meta name="body" content="See ticket details" />
</svelte:head>

<div class=" mx-4 my-12 flex flex-grow flex-row justify-center gap-6">
	<div class=" flex max-w-3xl flex-1 flex-col gap-6">
		<h1 class="bg-surface-variant rounded-xl p-2 shadow-lg">{ticket.title}</h1>

		<section
			class=" flex-1 overflow-y-scroll rounded-2xl border-2 border-secondary-container px-6 py-4 scrollbar-none"
		>
			{#if raw}
				{ticket.raw}
			{:else}
				{@html ticket.body?.code}
			{/if}
		</section>
	</div>
	<div class=" flex w-72 flex-col gap-6 rounded-2xl border-2 border-secondary-container px-6 py-4">
		<div>
			<span>Service</span>
			<span>{ticket.fromService}</span>
		</div>
		<div>
			<span>Status</span>
			<span>{ticket.status}</span>
		</div>
		<div>
			<span>Planned for</span>
			<span>{ticket.plannedFor}</span>
		</div>
	</div>
</div>
