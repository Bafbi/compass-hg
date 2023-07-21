<script>
	import {MultiSelect} from 'carbon-components-svelte';
	import "carbon-components-svelte/css/g90.css";
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
	<MultiSelect
	titleText="Contact"
  label="Select contact methods..."
  items={[
    { id: "0", text: "Slack" },
    { id: "1", text: "Email" },
    { id: "2", text: "Fax" },
  ]}
	/>
</section>
<!-- Tickets -->
<section>
	{#each tickets as ticketData (ticketData.id)}
		<Ticket {ticketData} />
	{/each}
</section>