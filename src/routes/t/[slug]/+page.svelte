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
	$: is_admin = data.session?.user?.is_admin;

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

	const {
		form: plannedForm,
		errors: plannedErrors,
		constraints: plannedConstraints
	} = superForm(data.updatePlannedForm);
	$: stringPlannedDate = $plannedForm.plannedFor
		? new Date($plannedForm.plannedFor.toString()).toLocaleDateString()
		: 'Pas de date';
</script>

<svelte:head>
	<title>{ticket.title} - Ticketing HG</title>
	<meta name="body" content="See ticket details" />
</svelte:head>

<div class=" mx-4 my-6 flex flex-grow flex-col justify-center gap-6 md:flex-row">
	<!-- Main content -->
	<div class=" flex max-w-4xl flex-grow flex-col gap-6">
		<h1 class="bg-surface-variant rounded-xl p-2 text-2xl font-semibold text-primary shadow-lg">
			{ticket.title}
		</h1>

		<section
			class=" .md flex-1 overflow-y-scroll rounded-2xl border-2 border-secondary-container px-6 py-4 scrollbar-none"
		>
			{#if raw}
				{ticket.raw}
			{:else}
				{@html ticket.body?.code}
			{/if}
		</section>
		{#if is_admin}
			<a
				class=" bg-tertiary w-fit rounded-md px-2 py-1"
				href="mailto:name@rapidtables.com?{new URLSearchParams({
					subject: 'new Ticket',
					body: ticket.transfertEmail
				})}"
				target="_blank"
				rel="noopener noreferrer">Transférer par mail</a
			>
		{/if}
	</div>
	<!-- Detail bar -->
	<div
		class=" flex flex-col gap-6 rounded-2xl border-2 border-secondary-container px-6 py-4 md:w-72"
	>
		<Updater name="Status" action="?/status" value={$statusForm.status} editable={is_admin}>
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
		<Updater name="Service" action="?/service" value={$serviceForm.fromService} editable={is_admin}>
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
		<Updater
			name="Tags"
			action="?/label"
			value={labels.map((label) => label.name).join(', ')}
			requireConfirm
			editable={is_admin}
		>
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
			{#if $labelErrors.labels}<span class="text-error">{$labelErrors.labels}</span>{/if}
		</Updater>
		<Updater
			name="Plannifier pour"
			action="?/planned"
			value={stringPlannedDate}
			editable={is_admin}
		>
			<input
				type="date"
				name="plannedFor"
				id="plannedFor"
				class="w-full bg-transparent"
				aria-invalid={$plannedErrors.plannedFor ? 'true' : undefined}
				bind:value={$plannedForm.plannedFor}
				{...$plannedConstraints.plannedFor}
			/>
			{#if $plannedErrors.plannedFor}<span class="text-error">{$plannedErrors.plannedFor}</span
				>{/if}
		</Updater>
		<div>
			<ul>
				{#each ticket.attachments as attachment}
					<li>
						<a href="/api/attachment/{attachment.id}" target="_blank" rel="noopener noreferrer"
							>{attachment.name}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
