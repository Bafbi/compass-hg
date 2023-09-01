<script lang="ts">
	import Selector from '$lib/components/Selector.svelte';
	import { statusEnumIded, serviceEnumIded } from '$lib/const';
	import { constructQueryString } from '$lib/filter';
	import Ticket from './Ticket.svelte';

	export let data;
	$: tickets = data.allTicketsPreview;
	$: filters = data.filters;
</script>

<svelte:head>
	<title>Home - Ticketing HG</title>
	<meta name="description" content="IT Ticketing app for Holweg" />
</svelte:head>

<div
	class=" mx-auto my-4 flex w-full flex-col gap-6 rounded-2xl border-2 border-secondary-container p-2 md:w-10/12 md:px-6 md:py-4"
>
	<!-- ToolBar -->
	<section class="bg-surface-variant rounded-xl p-2 shadow-lg">
		<div class="flex flex-col items-center gap-4 md:flex-row">
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

			<!-- Filters -->
			<div class="flex flex-row gap-2">
				<!-- Labels -->
				<Selector options={data.allLabels} filterName="tag" title="Tags" {filters} let:option>
					<div class="flex flex-row items-center gap-2 px-2">
						{#if option.selected}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M5 11L11 17L21 7"
								/>
							</svg>
						{/if}
						<span>{option.id}</span>
					</div>
				</Selector>
				<!-- Status -->
				<Selector options={statusEnumIded()} filterName="is" {filters} let:option>
					<div class="flex flex-row items-center gap-2 px-2">
						{#if option.selected}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M5 11L11 17L21 7"
								/>
							</svg>
						{/if}
						<span>{option.id}</span>
					</div>
				</Selector>
				<!-- Service -->
				<Selector options={serviceEnumIded()} filterName="from" {filters} let:option>
					<div class="flex flex-row items-center gap-2 px-2">
						{#if option.selected}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M5 11L11 17L21 7"
								/>
							</svg>
						{/if}
						<span>{option.id}</span>
					</div>
				</Selector>
			</div>
			<a href="new" class="bg-primary rounded-xl p-2">Créer un ticket</a>
			{#if data.session?.user.is_admin}
				<a href="l" class="bg-primary rounded-xl p-2">labels</a>
			{/if}
		</div>
	</section>
	<!-- Tickets -->
	<section class="flex flex-col gap-4">
		{#each tickets as ticket (ticket.id)}
			<Ticket {ticket} />
		{/each}
	</section>
</div>
