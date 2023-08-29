<script lang="ts">
	import { enhance } from '$app/forms';
	import { serviceEnum, statusEnum } from '$lib/const.js';
	import '$lib/style/md.css';
	import '$lib/style/prism.css';
	import { superForm } from 'sveltekit-superforms/client';
	import Updater from './Updater.svelte';

	export let data;
	$: ticket = data.ticket;
	$: labels = data.allLabels.filter((label) => ticket.labels.includes(label.id));

	let raw: boolean = false;

	const {
		form: statusForm,
		errors: statusErrors,
		constraints: statusConstraints
	} = superForm(data.updateStatusForm);

	const {
		form: serviceForm,
		errors: serviceErrors,
		constraints: serviceConstraints
	} = superForm(data.updateServiceForm);

	const {
		form: labelForm,
		errors: labelErrors,
		constraints: labelConstraints
	} = superForm(data.updateLabelForm);
	
</script>

<svelte:head>
	<title>{ticket.title} - Compass-HG</title>
	<meta name="body" content="See ticket details" />
</svelte:head>

<div class=" mx-4 my-12 flex flex-grow flex-col md:flex-row justify-center gap-6">
	<!-- Main content -->
	<div class=" flex max-w-4xl flex-grow flex-col gap-6">
		<h1 class="bg-surface-variant rounded-xl p-2 shadow-lg">{ticket.title}</h1>

		<section
			class=" flex-1 overflow-y-scroll rounded-2xl border-2 border-secondary-container px-6 py-4 scrollbar-none"
		>
			{#if raw}
				{ticket.raw}
			{:else}
				{@html ticket.body?.code}
			{/if}
		</section>
	</div>
	<!-- Detail bar -->
	<div class=" flex md:w-72 flex-col gap-6 rounded-2xl border-2 border-secondary-container px-6 py-4">
			<Updater name="Status" action="?/status" value={$statusForm.status}>
				<select
					name="status"
					id="status"
					class="w-full bg-transparent"
					aria-invalid={$statusErrors.status ? 'true' : undefined}
					bind:value={$statusForm.status}
					{...$statusConstraints.status}
				>
					{#each statusEnum as status}
						<option value={status} class=" bg-surface-variant">{status}</option>
					{/each}
				</select>
				{#if $statusErrors.status}<span class="text-error">{$statusErrors.status}</span>{/if}
			</Updater>
			<Updater name="Service" action="?/service" value={$serviceForm.fromService}>
				<select
					name="fromService"
					id="fromService"
					class="w-full bg-transparent"
					aria-invalid={$serviceErrors.fromService ? 'true' : undefined}
					bind:value={$serviceForm.fromService}
					{...$serviceConstraints.fromService}
				>
					{#each serviceEnum as service}
						<option value={service} class=" bg-surface-variant">{service}</option>
					{/each}
				</select>
				{#if $serviceErrors.fromService}<span class="text-error">{$serviceErrors.fromService}</span
					>{/if}
			</Updater>
			<Updater name="Labels" action="?/label" value={labels.map((label) => label.name).join(", ")} requireConfirm>
				<select
					name="labels"
					id="labels"
					class="w-full bg-transparent"
					multiple
					aria-invalid={$labelErrors.labels ? 'true' : undefined}
					bind:value={$labelForm.labels}
					{...$labelConstraints.labels}
				>
					{#each data.allLabels as label}
						<option value={label.id} class=" bg-surface-variant">{label.name}</option>
					{/each}
				</select>
				{#if $labelErrors.labels}<span class="text-error">{$labelErrors.labels}</span
					>{/if}
			</Updater>
		<div>
			<span>Planned for</span>
			<span>{ticket.plannedFor}</span>
		</div>
	</div>
</div>
