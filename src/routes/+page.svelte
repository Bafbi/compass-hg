<script>
	import Ticket from './Ticket.svelte';
	export let data;
	$: tickets = data.allTickets;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="IT Ticketing app for Holweg" />
</svelte:head>

<!-- Filter -->
<section>
	<button class="bg-primary rounded-lg p-2">
		<a href="new">
			Create Ticket
		</a>
	</button>
</section>
<!-- Tickets -->
<section>
	{#each tickets as ticketData (ticketData.id)}
		<Ticket {ticketData} />
	{/each}
</section>