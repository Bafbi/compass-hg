<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import { serviceEnum } from '$lib/const.js';
	import { marked } from 'marked';
	import '$lib/style/md.css';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { toast } from 'svoast';
	import { base } from '$app/paths';

	export let data;
	$: labels = data.allLabels;
	$: users = data.allUsers;
	// $: graphClient = data.graphClient;

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
	<form method="POST" class="flex flex-grow flex-col items-center gap-6 font-mono" use:enhance>
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
								class="focus:border-blue-300 bg-surface absolute z-10 w-full rounded border p-2 focus:outline-none focus:ring"
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
				<div
					class="bg-surface flex flex-1 appearance-none flex-col gap-1 rounded-md border border-secondary px-3 py-2 focus:shadow-outline focus:outline-none"
				>
					<div class="flex h-fit flex-row items-center justify-between">
						<div class=" w-fit overflow-hidden rounded-xl">
							<button
								type="button"
								data-selected={previewOpen}
								class=" px-2 py-1"
								on:click={() => (previewOpen = true)}>Preview</button
							>
							<button
								type="button"
								data-selected={!previewOpen}
								class=" px-2 py-1"
								on:click={() => (previewOpen = false)}>Edit</button
							>
						</div>
						<div>
							<input
								class=" bg-surface-variant mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] after:bg-surface checked:bg-primary-container checked:after:bg-primary checked:focus:bg-primary-container dark:checked:bg-primary dark:checked:after:bg-primary before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
								type="checkbox"
								role="switch"
								id="notify"
								name="notify"
								aria-invalid={$errors.notify ? 'true' : undefined}
								bind:checked={$form.notify}
								{...$constraints.notify}
							/>
							<label class="inline-block pl-[0.15rem] hover:cursor-pointer" for="notify"
								>Notify by email</label
							>
							{#if $errors.notify}<span class="text-error">{$errors.notify}</span>{/if}
						</div>
					</div>

					<div class="bg-surface-variant flex-1 rounded-lg">
						{#if previewOpen}
							<div
								class=" h-full w-full border-primary bg-transparent p-2 font-sans outline-tertiary"
							>
								{@html marked($form.body)}
							</div>
						{:else}
							<textarea
								class=" h-full w-full border-primary bg-transparent p-2 outline-tertiary"
								name="body"
								aria-invalid={$errors.body ? 'true' : undefined}
								bind:value={$form.body}
								placeholder="Content of the ticket"
								{...$constraints.body}
							/>
							{#if $errors.body}<span class="text-error">{$errors.body}</span>{/if}
						{/if}
					</div>
				</div>
			</div>
		</div>

		<button class="!bg-primary rounded-xl p-2" type="submit" on:click={() => (previewOpen = false)}
			>Submit</button
		>
	</form>
	<!-- <SuperDebug data={$form} /> -->
</div>

<style>
	button[data-selected='true'] {
		@apply bg-secondary;
	}
	button[data-selected='false'] {
		@apply bg-secondary-container;
	}
</style>
