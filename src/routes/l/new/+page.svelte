<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	$: cssVarStyles = `--light-color:oklch(99% 0.05 ${$form.color});--dark-color:oklch(20% 0.3 ${$form.color})`;
</script>

<svelte:head>
	<title>New Label - Ticketing HG</title>
	<meta name="body" content="Create new label" />
</svelte:head>

<div class=" flex flex-grow p-4">
	<form method="POST" class="flex flex-grow flex-col items-center gap-6">
		<!-- Name -->
		<label for="name">Nom</label>
		<input
			class="bg-surface-variant"
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<span class="text-error">{$errors.name}</span>{/if}
		<!-- Color -->
		<label for="color">Couleur</label>
		<input
			class=" bg-surface-variant"
			type="range"
			min="0"
			max="360"
			name="color"
			aria-invalid={$errors.color ? 'true' : undefined}
			bind:value={$form.color}
			{...$constraints.color}
		/>
		{#if $errors.color}<span class="text-error">{$errors.color}</span>{/if}
		<div class="label h-12 w-12" style={cssVarStyles} />
		<!-- Description -->
		<label for="description">Description</label>
		<textarea
			class="bg-surface-variant"
			name="description"
			aria-invalid={$errors.description ? 'true' : undefined}
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}<span class="text-error">{$errors.description}</span>{/if}
		<!-- Public -->
		<label for="public">Public</label>
		<input
			class="bg-surface-variant"
			type="checkbox"
			name="public"
			aria-invalid={$errors.public ? 'true' : undefined}
			bind:checked={$form.public}
			{...$constraints.public}
		/>
		{#if $errors.public}<span class="text-error">{$errors.public}</span>{/if}
		<!-- Submit -->
		<button class="" type="submit" />
	</form>
	<SuperDebug data={$form} />
</div>
