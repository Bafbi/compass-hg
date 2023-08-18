<script lang="ts">
	import type { Label } from '$lib/server/schema';

	export let label: Label;

	$: cssVarStyles = `--light-color:oklch(99% 0.05 ${label.color});--dark-color:oklch(20% 0.3 ${label.color})`;
</script>

<div class="my-auto rounded-full px-2 py-1 text-xs label" style={cssVarStyles}>
	{label.name}
</div>

<style>
	@media (prefers-color-scheme: dark) {
		.label {
			background-color: var(--dark-color);
			color: var(--light-color);
		}
	}

	@media (prefers-color-scheme: light) {
		.label {
			background-color: var(--light-color);
			color: var(--dark-color);
		}
	}
</style>
