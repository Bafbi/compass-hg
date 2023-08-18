<script>
	import SelectMulti from '$lib/components/SelectMulti.svelte';
	import { parseQueryString } from '$lib/filter';
	import Ticket from './Ticket.svelte';
	export let data;
	$: tickets = data.allTicketsPreview;
	$: labels = data.allLabels;
	$: servicesEnum = data.serviceEnum;
	$: statusEnum = data.statusEnum;
	let filters = data.filters;

	// console.log(data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="IT Ticketing app for Holweg" />
</svelte:head>

<div
	class=" mx-auto my-4 flex w-5/6 flex-col gap-6 rounded-2xl border-2 border-secondary-container px-6 py-4"
>
	<!-- ToolBar -->
	<section class="bg-surface-variant flex flex-col gap-2 rounded-xl p-2 shadow-lg">
		<div class="flex gap-4">
			<!-- Query -->
			<form action="?/" method="get" class="flex-1">
				<input
					class="bg-surface w-full appearance-none rounded-md border border-tertiary px-3 py-2 focus:shadow-outline focus:outline-none"
					type="search"
					placeholder="Query"
					value={filters.query}
					name="q"
				/>
			</form>

			<button class="bg-primary rounded-xl p-2">
				<a href="new"> Create Ticket </a>
			</button>
		</div>
		<!-- Filters -->
		<div class="flex gap-4">
			<!-- Labels -->
			<details class="">
				<summary class="bg-primary rounded-xl p-2">Labels</summary>
				<div class="flex flex-col gap-2 absolute ">
					{#each labels as label (label.id)}
						<a href="?q={filters.createAppendQuery("label", label.name)}" class="bg-surface-variant rounded-xl p-2">
							{label.name}
						</a>
					{/each}
				</div>
			</details>
		</div>
	</section>
	<!-- Tickets -->
	<section class="flex flex-col gap-4">
		{#each tickets as ticket (ticket.id)}
			<Ticket {ticket} />
			<Ticket {ticket} />
		{/each}
	</section>
</div>
