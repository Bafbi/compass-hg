<script lang="ts">
    export let data;

    $: labels = data.allLabels;
</script>

<svelte:head>
    <title>Labels - Ticketing HG</title>
    <meta name="body" content="Manage labels details" />
</svelte:head>

<div class="flex flex-grow flex-col gap-6">
    <h1 class="bg-surface-variant rounded-xl p-2 text-2xl font-semibold text-primary shadow-lg">
        Labels
    </h1>

    <section class="flex flex-col gap-6">
        <div class="flex flex-row items-center gap-2">
            <span class="text-xl">Labels</span>
            <a href="/l/new" class="text-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </a>
        </div>
        <div class="flex flex-row flex-wrap gap-2">
            {#each labels as label}
                <a
                    href={`/l/${encodeURIComponent(label.id)}`}
                    class="bg-surface-variant rounded-xl p-2 text-sm"
                >
                    {label.id}
                </a>
            {/each}
        </div>
    </section>
</div>