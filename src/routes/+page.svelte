<script lang="ts">
	import Selector from '$lib/components/Selector.svelte';
	import { statusEnum } from '$lib/const';
	import { constructQueryString } from '$lib/filter';
	import Ticket from './Ticket.svelte';
	export let data;
	$: tickets = data.allTicketsPreview;
	$: filters = data.filters;
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
					value={constructQueryString(filters)}
					name="q"
				/>
			</form>

			<a href="new" class="bg-primary rounded-xl p-2"> Create Ticket </a>
		</div>
		<!-- Filters -->
		<div class="flex gap-4">
			<!-- Labels -->
			<!-- <Selector options={data.allLabels} filterName="label" {filters} let:option>
				{option.id + "   " + option.selected}
			</Selector> -->
			<!-- Status -->
			<Selector options={statusEnum} filterName="is" {filters} let:option>
				{option.id + "   " + option.selected}
			</Selector>
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
