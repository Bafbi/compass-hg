<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	export let data;
	$: allUsers = data.allUsers
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
</section>
<section>
	<div class="prose">
		<div class="md:w-[80vw] prose-h1:md:text-5xl">
			<h1>Welcome to SvelteKit + <span class="text-warning">Drizzle ORM</span></h1>
			<blockquote>
				<h4>This Data Comes from Database :</h4>
			</blockquote>
			<div class="px-10">
				<table>
					{#each allUsers as item}
						<tr>
							<th>
								<h3>{item.fullName}</h3>
							</th>
							<th class="shade"><h3>{item.quote}</h3></th>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	th,
	tr {
		padding: 0px 10px;
		border: 1px solid #827f7f;
	}
	h3 {
		margin: 10px 5px;
	}
	.shade{
		background: #f5f5f513;
	}
</style>
