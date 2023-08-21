<script lang="ts">
	import {
		type TicketsFilters,
		type FilterTypeStrings,
		getFilterKey,
		removeQuery,
		appendQuery,

		removeMultipleQuery

	} from '$lib/filter';
	type T = $$Generic<{ id: string }[]>;
	type U = T & { selected: boolean };

	export let filters: TicketsFilters;
	export let filterName: FilterTypeStrings;
	export let options: T;

	$: data = options.map((option) => ({
		...option,
		selected: filters[getFilterKey(filterName)]?.includes(option.id) ?? false
	}));

	let open = false;
	let container: HTMLDivElement;
	let search = '';

	// uppercase the first letter of the key filter name
	let title = getFilterKey(filterName).charAt(0).toUpperCase() + getFilterKey(filterName).slice(1);

	$: unselectQuery = removeMultipleQuery(filters, filterName, data
		.filter((option) => option.selected).map((option) => option.id));

	$: dataFiltered = data.filter((option) => option.id.includes(search));
</script>

<svelte:window
	on:click={(e) => {
		if (!container.contains(e.target)) open = false;
	}}
/>

<details class="h-full" bind:open>
	<summary class="bg-secondary text-sm rounded-xl p-2">{title}</summary>
	<div
		class="bg-tertiary-container absolute z-10 flex flex-col gap-2 rounded-md p-2"
		bind:this={container}
	>
		<header>
			<span>filter by {title}</span>
		</header>
		<input type="search" bind:value={search} />

		<a
			class="bg-primary rounded-xl p-2"
			href="?q={unselectQuery}"
		>
			Unselect
		</a>

		{#each dataFiltered as option (option.id)}
			{#if option.selected}
				<a
					class="bg-primary rounded-xl p-2"
					href="?q={removeQuery(filters, filterName, option.id)}"
				>
					<slot {option} />
				</a>
			{:else}
				<a
					class="bg-surface-variant rounded-xl p-2"
					href="?q={appendQuery(filters, filterName, option.id)}"
				>
					<slot {option} />
				</a>
			{/if}
		{/each}
	</div>
</details>
