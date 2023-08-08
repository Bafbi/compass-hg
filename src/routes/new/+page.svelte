<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

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
	<title>New Ticket - Compass-HG</title>
	<meta name="body" content="Create new ticket" />
</svelte:head>

<!-- new ticket form -->
<section>
	<div class="bg-secondary-container mx-auto max-w-md rounded-md p-8 shadow">
		<form method="POST" use:enhance>
			<label for="title">Title</label>
			<input
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				type="text"
				name="title"
				aria-invalid={$errors.title ? 'true' : undefined}
				bind:value={$form.title}
				{...$constraints.title}
			/>
			{#if $errors.title}<span class="text-error">{$errors.title}</span>{/if}

			<label for="fromService">fromService</label>
			<select
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				name="fromService"
				aria-invalid={$errors.title ? 'true' : undefined}
				bind:value={$form.fromService}
				{...$constraints.fromService}
			>
				{#each data.serviceEnum as service}
					<option value={service}>{service}</option>
				{/each}
			</select>
			{#if $errors.fromService}<span class="text-error">{$errors.fromService}</span>{/if}

			<label for="body">Body</label>
			<textarea
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				name="body"
				aria-invalid={$errors.body ? 'true' : undefined}
				bind:value={$form.body}
				{...$constraints.body}
			/>
			{#if $errors.body}<span class="text-error">{$errors.body}</span>{/if}

			{#if data.session?.user.is_admin}
			<label for="requester">Requester</label>
			<input
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				name="body"
				type="search"
				aria-invalid={$errors.requester ? 'true' : undefined}
				bind:value={$form.requester}
				{...$constraints.requester}
			/>
			{#if $errors.requester}<span class="text-error">{$errors.requester}</span>{/if}
			{/if}

			<button type="submit">Submit</button>
		</form>
	</div>
</section>