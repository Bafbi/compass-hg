<script lang="ts">
	import { ComboBox } from 'carbon-components-svelte';
	import "carbon-components-svelte/css/g90.css";
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;
	// $: graphClient = data.graphClient;

	// let users = getUsers();
	// async function getUsers() {
	// 	if (!graphClient) return null;
	// 		 return graphClient.api("/User.ReadBasic.All").get();
	// }


	const { form, errors, constraints } = superForm(data.form);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="IT Ticketing app for Holweg" />
</svelte:head>

<!-- Filter -->
<section>
	<SuperDebug data={$form} />
	<form method="POST" action="?/new">
		<label for="title">Title</label>
		<input
			type="text"
			name="title"
			aria-invalid={$errors.title ? 'true' : undefined}
			bind:value={$form.title}
			{...$constraints.title}
		/>
		{#if $errors.title}<span class="invalid">{$errors.title}</span>{/if}
		<label for="fromService">fromService</label>
		<ComboBox
			items={[
				{ id: "0", text: "Slack" },
				{ id: "1", text: "Email" },
				{ id: "2", text: "Fax" },
			]}
			name="fromService"
			aria-invalid={$errors.fromService ? 'true' : undefined}
			bind:value={$form.fromService}
			{...$constraints.fromService}
		/>

		{#if $errors.fromService}<span class="invalid">{$errors.fromService}</span>{/if}
		<button type="submit">Submit</button>
	</form>

</section>