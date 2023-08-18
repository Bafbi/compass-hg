<script lang="ts">

	import { type TicketsFilters, type FilterTypeStrings, getFilterKey, removeQuery, appendQuery } from '$lib/filter';
	type T = $$Generic<{ id: string }[] | readonly string[]>;
	type U = T & { selected: boolean };

	export let filters: TicketsFilters;
	export let filterName: FilterTypeStrings;
	export let options: T;

	let open = false;
	let container: HTMLDivElement;
	let search = '';

    console.log(options);
    console.log(filters[getFilterKey(filterName)]);
    
    
    
	$: dataFiltered = {
        if options {

        }
    } options
		.filter((data) => data.id.includes(search))
		.map((data) => ({
			...data,
			selected: Array.isArray(filters[getFilterKey(filterName)]) ? filters[getFilterKey(filterName)]?.includes(data.id) : filters[getFilterKey(filterName)] == data
		}));

        
</script>

<svelte:window
	on:click={(e) => {
		if (!container.contains(e.target)) open = false;
	}}
/>

<details class="" bind:open>
	<summary class="bg-primary rounded-xl p-2">Labels</summary>
	<div
		class="bg-tertiary-container absolute z-10 flex flex-col gap-2 rounded-md p-2"
		bind:this={container}
	>
		<header>
			<span>filter by labels</span>
		</header>
		<input type="search" bind:value={search} />

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
