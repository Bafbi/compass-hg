<!-- SelectMulti -->

<script lang="ts">
	import type { Label } from '$lib/server/schema';

	type Option = { id: string; name: string };

	export let options: Option[] = [];
	export let selectedOptions: string[] = [];

	let open = false;

	function toggleOption(option: Option) {
		if (selectedOptions.includes(option.id)) {
			selectedOptions = selectedOptions.filter((item) => item !== option.id);
		} else {
			selectedOptions = [...selectedOptions, option.id];
		}
	}
</script>

<div class="relative">
	<label for="select-multiple" class="text-gray-700 block font-medium"
		>Select Multiple Options:</label
	>
	<div
		class="border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 mt-1 w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
	>
		<button
			type="button"
			class="border-gray-300 focus:ring-indigo-500 w-full rounded-md border bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
			id="select-multiple-button"
			aria-haspopup="listbox"
			aria-expanded="true"
			on:click={() => (open = !open)}
		>
			<span class="block truncate">
				{selectedOptions.length === 0
					? 'Select options'
					: selectedOptions
							.map((optionId) => options.find((opt) => opt.id === optionId)?.name)
							.join(', ')}
			</span>
		</button>
		{#if open}
			<div class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
				<ul
					tabindex="-1"
					role="listbox"
					aria-labelledby="select-multiple-button"
					aria-activedescendant="selected-option"
					class="py-1"
				>
					{#each options as option (option)}
						<li
							role="option"
							id="selected-option"
							class="relative cursor-pointer select-none py-2 pl-3 pr-9"
						>
							<label class="flex cursor-pointer items-center justify-between">
								<span class="block truncate">{option.name}</span>
								<input
									type="checkbox"
									class="form-checkbox text-indigo-600 h-4 w-4"
									checked={selectedOptions.includes(option.id)}
									on:change={() => toggleOption(option)}
								/>
							</label>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<p class="text-gray-500 mt-2 text-sm">Selected Options: {selectedOptions.join(', ')}</p>
