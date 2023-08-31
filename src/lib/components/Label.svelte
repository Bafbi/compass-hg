<script lang="ts">
	import type { Label } from '$lib/server/schema';

	export let label: Label;

	$: cssVarStyles = `--light-color:oklch(99% 0.05 ${label.color});--dark-color:oklch(20% 0.3 ${label.color})`;
</script>

<div class="label my-auto rounded-full px-2 py-1 text-xs" style={cssVarStyles}>
	{label.name}
</div>
