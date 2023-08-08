<script lang="ts">
  import './md.css';

	export let data;
	$: ticket = data.ticket;
</script>

<svelte:head>
	<title>{ticket.title} - Compass-HG</title>
	<meta name="body" content="See ticket details" />
</svelte:head>

<section>{@html ticket.body?.code}</section>
