<script>
	import Ticket from './Ticket.svelte';
	export let data;
	$: tickets = data.allTickets;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="IT Ticketing app for Holweg" />
</svelte:head>

<div class=" my-4 mx-auto w-5/6 rounded-2xl py-4 px-6 gap-6 flex flex-col border-2 border-secondary-container">
<!-- ToolBar -->
<section class="bg-surface-variant p-2 rounded-xl shadow-lg flex gap-4">
	<!-- Search -->
	<input class="flex-1 bg-surface appearance-none rounded-md border border-tertiary px-3 py-2 focus:shadow-outline focus:outline-none"
		type="search"
		value="&&"
	/>
	<button class="bg-primary p-2 rounded-xl">
		<a href="new">
			Create Ticket
		</a>
	</button>
</section>
<!-- Tickets -->
<section class="flex flex-col gap-4">
	{#each tickets as ticket (ticket.id)}
		<Ticket {ticket} />
		<Ticket {ticket} />


	{/each}
</section>
</div>