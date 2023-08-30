<script lang="ts">
	import MediaQuery from './MediaQuery.svelte';

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
	let container: HTMLElement;
	let dialog: HTMLDialogElement;
	let search = '';

	$: if (dialog && open) {
		dialog.showModal();
	} else if (dialog && !open) {
		dialog.close();
	}

	$: if (dialog) container = dialog.firstElementChild as HTMLElement;


	// uppercase the first letter of the key filter name
	let title = getFilterKey(filterName).charAt(0).toUpperCase() + getFilterKey(filterName).slice(1);

	$: unselectQuery = removeMultipleQuery(
		filters,
		filterName,
		data.filter((option) => option.selected).map((option) => option.id)
	);

	$: dataFiltered = data.filter((option) => option.id.includes(search));
</script>

<svelte:window
	on:click={(e) => {
		// @ts-ignore
		if (!container.contains(e.target)) open = false;
	}}
/>

<details class="h-full" bind:open>
	<summary class="bg-secondary rounded-xl p-2 text-sm">{title}</summary>
	<MediaQuery query="(max-width: 480px)" let:matches>
		{#if matches}
			<dialog bind:this={dialog}>
				<div
					class="bg-secondary-container flex flex-col gap-2 rounded-md p-2"
					bind:this={container}
				>
					<header>
						<span>filter by {title}</span>
					</header>
					<input type="search" bind:value={search} />

					<a class="bg-secndary rounded-xl p-2" href="?q={unselectQuery}"> Unselect </a>

					{#each dataFiltered as option (option.id)}
						{#if option.selected}
							<a
								class="bg-primary"
								href="?q={removeQuery(filters, filterName, option.id)}"
							> 
								<slot {option} />
							</a>
						{:else}
							<a
								class="bg-surface-variant"
								href="?q={appendQuery(filters, filterName, option.id)}"
							>
								<slot {option} />
							</a>
						{/if}
					{/each}
				</div>
			</dialog>
		{:else}
			<div
				class="bg-secondary-container absolute z-10 flex flex-col gap-2 rounded-md p-2"
				bind:this={container}
			>
				<header >
					<span>Filtrer par {title}</span>
				</header>
				<input type="search" bind:value={search} class=" bg-surface px-1 rounded-sm" placeholder="rechercher" />

				<a class="bg-tertiary rounded-md px-2" href="?q={unselectQuery}"> Unselect </a>

				{#each dataFiltered as option (option.id)}
					{#if option.selected}
						<a
							class="bg-primary rounded-md "
							href="?q={removeQuery(filters, filterName, option.id)}"
						>
							<slot {option} />
						</a>
					{:else}
						<a
							class="bg-surface-variant rounded-md shadow-md"
							href="?q={appendQuery(filters, filterName, option.id)}"
						>
							<slot {option} />
						</a>
					{/if}
				{/each}
			</div>
		{/if}
	</MediaQuery>
</details>
