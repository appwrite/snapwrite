<script lang="ts">
	import { getImageFromDisk } from '$lib/utils/getImageFromDisk';

	/**
	 * Represents a base64 encoded image.
	 */
	export let value: string | null;
</script>

<button
	aria-label="Select file"
	on:click={async () => {
		value = await getImageFromDisk();
	}}
>
	<span class="block i-tabler-photo" aria-hidden />
</button>

<style lang="scss">
	button {
		@include border-gradient;
		--p-border-radius: 0.5rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);

		background: hsl(var(--color-white-hsl) / 0.08);

		--p-size: 2.5rem;
		width: var(--p-size);
		height: var(--p-size);
		display: grid;
		place-items: center;

		transition: 150ms ease;

		&:hover {
			background: hsl(var(--color-white-hsl) / 0.12);
		}

		&:active {
			background: hsl(var(--color-white-hsl) / 0.1);
		}
	}
</style>
