<script lang="ts">
	import type { InsertTicket } from '$lib/server/schema';
	import githubLogo from '$lib/images/github.svg';
	import dayjs, { Dayjs } from 'dayjs';
	import type { TicketPreview } from './proxy+page.server';
	import Label from '$lib/components/Label.svelte';

	export let ticket: TicketPreview;

</script>

<a href={'t/' + ticket.id}>
	<div
		class=" relative flex flex-col sm:flex-row gap-2 overflow-hidden rounded-xl bg-gradient-to-bl from-surface from-60% to-secondary-container p-4 shadow-lg"
	>
		<!-- Status indicator -->
		<div
			data-status={ticket.status}
			class=" absolute bottom-0 left-0 top-0 w-1"
			title="Status : {ticket.status.toLocaleLowerCase()}"
		/>
		<div class="shrink-0 hidden sm:block">
			<img class="h-12 w-12" src={githubLogo} alt="ChitChat Logo" />
		</div>
		<div class="flex-1 overflow-hidden">
			<div class="whitespace-normal text-xl font-bold text-primary" title={ticket.body}>
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
		</div>
		<div class="flex flex-row flex-wrap">
			{#each ticket.labels as label}
				<Label {label} />
			{/each}
		</div>
	</div>
</a>

<style>
	div[data-status='OPEN'] {
		background-color: #10b981;
	}
	div[data-status='CLOSED'] {
		background-color: #ef4444;
	}
	div[data-status='PENDING'] {
		background-color: #f59e0b;
	}
</style>