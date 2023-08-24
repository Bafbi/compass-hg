<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import { serviceEnum } from '$lib/const.js';
	import { marked } from 'marked';
	import '$lib/style/md.css';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { toast } from 'svoast';

	export let data;
	$: labels = data.allLabels;
	$: users = data.allUsers;
	$: graphClient = data.graphClient;

	let previewOpen = false;

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

<div class=" flex flex-grow p-4">
	<form
		method="POST"
		class="flex flex-grow flex-col items-center gap-6"
		use:enhance
	>
		<!-- Title -->
		<div class="w-11/12">
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
		</div>
		<div
			class=" flex w-full flex-1 flex-col gap-6 rounded-2xl border-2 border-secondary-container p-2 md:w-10/12 md:px-6 md:py-4 xl:flex-row-reverse"
		>
			<!-- Details -->
			<div class="flex flex-col gap-4 xl:w-80">
				<div>
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
				</div>
				<div>
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
				</div>

				<!-- labels -->
				<div>
					<label for="labels">Labels</label>

					<details class="relative">
						<summary
							class="bg-surface w-full appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
							>{$form.labels}</summary
						>
						<div>
							<select
								name="labels"
								multiple
								bind:value={$form.labels}
								class="focus:border-blue-300 bg-surface absolute w-full rounded border p-2 focus:outline-none focus:ring"
							>
								{#each labels as label}
									<option value={label.id}>{label.name}</option>
								{/each}
							</select>
						</div>
					</details>
				</div>
			</div>
			<div class="flex flex-grow flex-col">
				<label for="body">Body</label>
				<div>
					<button type="button" on:click={() => (previewOpen = true)}>Preview</button>
					<button type="button" on:click={() => (previewOpen = false)}>Raw</button>
				</div>
				{#if previewOpen}
					<div
						class="markdown bg-surface w-full flex-1 appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
					>
						{@html marked($form.body)}
					</div>
				{:else}
					<textarea
						class="bg-surface w-full flex-1 appearance-none rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
						name="body"
						aria-invalid={$errors.body ? 'true' : undefined}
						bind:value={$form.body}
						{...$constraints.body}
					/>
					{#if $errors.body}<span class="text-error">{$errors.body}</span>{/if}
				{/if}
			</div>
		</div>

		<button class="!bg-primary rounded-xl p-2" type="submit" on:click={() => (previewOpen = false)}
			>Submit</button
		>
	</form>
	<!-- <SuperDebug data={$form} /> -->
</div>
