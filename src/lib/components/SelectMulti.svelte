<script lang="ts">
	export let options: { id: string; name: string; description: string | null }[] = [];
	export let selectedOptions: string[] = [];

	function toggleOption(id: string) {
		if (selectedOptions.includes(id)) {
			selectedOptions = selectedOptions.filter((item) => item !== id);
		} else {
			selectedOptions = [...selectedOptions, id];
		}
	}
</script>

<div class="space-y-2">
	{#each options as option (option.id)}
		<label class="flex items-center space-x-2">
			<input
				name={option.id}
				id={option.id}
				type="checkbox"
				class="form-checkbox"
				checked={selectedOptions.includes(option.id)}
				on:change={() => toggleOption(option.id)}
			/>
			<span>{option.name}</span>
		</label>
	{/each}
</div>
