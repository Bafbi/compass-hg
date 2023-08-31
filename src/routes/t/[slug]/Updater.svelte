<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let action: string;
	export let name: string;
	export let value: string;
	export let requireConfirm = false;
	export let editable = false;

	let editStatus = false;
	let formElem: HTMLFormElement;
</script>

<div class="flex flex-col">
	<div class="bg-secondary-container z-10 flex flex-row justify-between rounded-lg px-2 py-1">
		<span class=" text-lg underline">{name}</span>
		{#if editable}
			<div class=" flex flex-row">
				{#if editStatus}
					{#if requireConfirm}
						<button on:click={() => formElem.requestSubmit()}>
							<!-- Confirm -->
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M5 11L11 17L21 7"
								/>
							</svg>
						</button>
					{/if}
					<button on:click={() => (editStatus = false)}>
						<!-- Cancel -->
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
							/></svg
						>
					</button>
				{:else}
					<button on:click={() => (editStatus = true)}>
						<!-- Edit -->
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0L5 16ZM15 6l3 3m-5 11h8"
							/></svg
						>
					</button>
				{/if}
			</div>
		{/if}
	</div>
	{#if editStatus}
		<!-- Submit when the value change -->
		<form
			bind:this={formElem}
			{action}
			method="POST"
			on:change={() => {
				if (!requireConfirm) formElem.requestSubmit();
			}}
			class="-translate-y-3 rounded-lg border border-secondary-container px-2 py-1 pt-4"
		>
			<slot />
		</form>
	{:else}
		<span class=" -translate-y-3 rounded-lg border border-secondary-container px-2 py-1 pt-4"
			>{value}</span
		>
	{/if}
</div>
