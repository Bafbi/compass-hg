<script lang="ts">
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
	<title>New Ticket - Compass-HG</title>
	<meta name="description" content="Create new ticket" />
</svelte:head>

<SuperDebug data={$form} />
<!-- new ticket form -->
<section>
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
		<select name="fromServide">
			{
				#each data.serviceEnum as service}
					<option value={service.toLowerCase()}>{service}</option>
				{/each
			}
		</select>

		{#if $errors.fromService}<span class="invalid">{$errors.fromService}</span>{/if}
		<button type="submit">Submit</button>
	</form>

</section>
<section>
	<div class="max-w-md mx-auto bg-white shadow p-8 rounded-md">
		<h2 class="text-2xl font-bold mb-4">Créer un nouveau ticket</h2>
		<form >
			<div class="mb-4">
				<label class="block text-gray-700 font-bold mb-2" for="title">Titre :</label>
				<input
					type="text"
					id="title"
					class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 font-bold mb-2" for="description">Description :</label>
				<textarea
					id="description"
					class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					rows="4"
					required
				></textarea>
			</div>
			<div class="flex justify-end">
				<button
					type="submit"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				>
					Soumettre
				</button>
			</div>
		</form>
	</div>
</section>