<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	$: cssVarStyles = `--light-color:oklch(90% 0.08 ${$form.color});--dark-color:oklch(20% 0.2 ${$form.color})`;

	onMount(() => {
		$form.color = Number.parseInt($form.color.toString());
	});
</script>

<svelte:head>
	<title>Edit label - Ticketing HG</title>
	<meta name="body" content="Edit label detail" />
</svelte:head>

<!-- Label editor => POST?/update -->
<div class=" flex flex-grow p-4">
	<form method="POST" class="flex flex-grow flex-col items-center gap-6" action="?/update">
		<!-- Color -->
		<label for="color">Couleur</label>
		<input
			class="bg-surface-variant"
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
		<button class="bg-primary rounded-xl p-2"> Modifier </button>
	</form>

	<SuperDebug data={$form} />
</div>
<!-- Delete button => POST?/remove -->
<div class="flex flex-row justify-center gap-2">
	<form method="POST" action="?/remove">
		<button class="bg-error rounded-xl p-2"> Supprimer </button>
	</form>
</div>
