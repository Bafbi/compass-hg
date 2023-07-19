<script>
	import { page } from '$app/stores';
</script>

<header>
	<div class="signedInStatus">
		<p class="nojs-show loaded">
			{#if $page.data.session}
				{#if $page.data.session.user?.image}
					<span
						style="background-image: url('{$page.data.session.user.image}')"
						class="avatar"
					/>
				{/if}
				<span class="signedInText">
					<small>Signed in as</small><br />
					<strong
						>{$page.data.session.user?.email ??
							$page.data.session.user?.name}</strong
					>
				</span>
				<a href="/auth/signout" class="button" data-sveltekit-preload-data="off">Sign out</a>
			{:else}
				<span class="notSignedInText">You are not signed in</span>
				<a href="/auth/signin" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</a>
			{/if}
		</p>
	</div>
	<nav>
		<ul class="navItems">
			<li class="navItem"><a href="/">Home</a></li>
			<li class="navItem"><a href="/protected">Protected</a></li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
