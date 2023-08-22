<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { serviceEnum } from '$lib/const.js';

	export let data;
	$: labels = data.allLabels;
	$: users = data.allUsers;
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

<div
	class=" mx-auto my-4 flex w-full flex-col gap-6 rounded-2xl border-2 border-secondary-container p-2 md:w-10/12 md:px-6 md:py-4"
>
	<form method="POST" class="flex flex-col gap-6" use:enhance>
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
		<!-- Details -->
		<section class="flex flex-col">
			<label for="body">Body</label>
			<textarea
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				name="body"
				aria-invalid={$errors.body ? 'true' : undefined}
				bind:value={$form.body}
				{...$constraints.body}
			/>
			{#if $errors.body}<span class="text-error">{$errors.body}</span>{/if}

			<label for="fromService">fromService</label>
			<select
				class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				name="fromService"
				aria-invalid={$errors.title ? 'true' : undefined}
				bind:value={$form.fromService}
				{...$constraints.fromService}
			>
				{#each serviceEnum as service}
					<option value={service}>{service}</option>
				{/each}
			</select>
			{#if $errors.fromService}<span class="text-error">{$errors.fromService}</span>{/if}

			{#if data.session?.user?.is_admin}
				<label for="requester">Requester</label>
				<select
					class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
					name="requester"
					aria-invalid={$errors.requester ? 'true' : undefined}
					bind:value={$form.requester}
					{...$constraints.requester}
				>
					{#each users as user}
						<option value={user.id}>{user.name}</option>
					{/each}
			</select>
				{#if $errors.requester}<span class="text-error">{$errors.requester}</span>{/if}
			{/if}

			<!-- labels -->
			<details>
				<summary>Labels</summary>
				<div>
					<label for="labels">Labels</label>
					<select
						name="labels"
						multiple
						bind:value={$form.labels}
						class="focus:border-blue-300 w-full rounded border p-2 focus:outline-none focus:ring"
					>
						{#each labels as label}
							<option value={label.id}>{label.name}</option>
						{/each}
					</select>
				</div>
			</details>
		</section>
		<button type="submit">Submit</button>
	</form>
</div>
<SuperDebug data={$form} />
