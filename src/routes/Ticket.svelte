<script lang="ts">
	import type { InsertTicket } from '$lib/server/schema';
	import githubLogo from '$lib/images/github.svg';
	import dayjs, { Dayjs } from 'dayjs';
	import type { TicketPreview } from './proxy+page.server';

	export let ticket: TicketPreview;
</script>

<a href={'t/' + ticket.id}>
	<div
		class=" bg-gradient-to-bl from-surface from-60% to-secondary-container flex space-x-4 rounded-xl p-4 shadow-lg"
	>
		<div class="shrink-0">
			<img class="h-12 w-12" src={githubLogo} alt="ChitChat Logo" />
		</div>
		<div class="flex-1 overflow-hidden">
			<div class="text-xl font-bold text-primary whitespace-normal" title={ticket.body}>{ticket.title}</div>
			<p class="text-sm text-outline">#{ticket.id}</p>
		</div>
		<div>
			<div class="">Status: {ticket.status}</div>
			<div class="text-outline">Service: {ticket.fromService}</div>
		</div>
		<div class="text-right min-w-fit">
			<div class="text-outline text-sm">
				<span>Open</span>
				{#if dayjs().diff(ticket.createdAt, 'day') < 1}
					<span>{dayjs().diff(ticket.createdAt, 'hour')}h</span>
				{:else}
					<span>{dayjs().diff(ticket.createdAt, 'day')}d</span>
				{/if}
        <span>ago</span>
			</div>
			<span class="text-outline text-sm">by {ticket.createdBy_name}</span>
		</div>
	</div>
</a>
