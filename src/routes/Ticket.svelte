<script lang="ts">
	import dayjs from 'dayjs';
	import type { TicketPreview } from './proxy+page.server';
	import Label from '$lib/components/Label.svelte';
	import { lastViewed } from '$lib/lastViewedStorage';

	export let ticket: TicketPreview;

	$: viewDate = $lastViewed[ticket.id] ? dayjs($lastViewed[ticket.id]) : null;
</script>

<a
	href={'t/' + ticket.id}
	on:click={() => {
		$lastViewed = { ...$lastViewed, [ticket.id]: dayjs().toJSON() };
	}}
>
	<div
		class=" relative flex flex-col gap-2 overflow-hidden rounded-xl bg-gradient-to-bl from-surface from-60% to-secondary-container p-4 shadow-lg sm:flex-row"
	>
		<!-- Status indicator -->
		<div
			data-status={ticket.status}
			class=" absolute bottom-0 left-0 top-0 w-1"
			title="Status : {ticket.status.toLocaleLowerCase()}"
		/>
		<!-- Show marker in top right if ticket was never view or update_at is newer -->
		{#if viewDate}
			{#if dayjs(ticket.updatedAt).isAfter(viewDate)}
				<div class="bg-primary absolute right-0 top-0 h-2 w-2 rounded-full" />
			{/if}
		{:else}
			<div class="bg-tertiary absolute right-0 top-0 h-2 w-2 rounded-full" />
		{/if}
		<div class="flex-1 overflow-hidden">
			<div class="whitespace-normal text-xl font-bold text-primary">
				{ticket.title}
			</div>
			<div class="text-sm text-outline">
				<!-- <span class=" font-light">#{ticket.id}</span> -->
				<span>Open</span>
				<strong>
					{#if dayjs().diff(ticket.createdAt, 'day') < 1}
						<span>{dayjs().diff(ticket.createdAt, 'hour')}h</span>
					{:else}
						<span>{dayjs().diff(ticket.createdAt, 'day')}d</span>
					{/if}
				</strong>
				<span>ago</span>
				<span class="">by <strong>{ticket.requester_name}</strong></span>
				<span class="">from <strong>{ticket.fromService}</strong></span>
			</div>
			{#if ticket.plannedFor}
				<div class="text-sm text-outline">
					<span>Planifier pour</span>
					<span><strong> {dayjs(ticket.plannedFor).format('DD/MM/YYYY')}</strong></span>
				</div>
			{/if}
		</div>
		<div class="flex flex-row flex-wrap">
			{#each ticket.labels as label}
				<Label {label} />
			{/each}
		</div>
	</div>
</a>

<style>
	div[data-status='Ouvert'] {
		background-color: #10b981;
	}
	div[data-status='Fermé'] {
		background-color: #ef4444;
	}
	div[data-status='En attente'] {
		background-color: #f59e0b;
	}
	div[data-status='Plannifier'] {
		background-color: #3b82f6;
	}
</style>
