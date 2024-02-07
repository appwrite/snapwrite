<script lang="ts">
	import { getImageFromDisk } from '$lib/utils/getImageFromDisk';
	import { melt } from '@melt-ui/svelte';
	import Tooltip from './Tooltip.svelte';

	/**
	 * Represents a base64 encoded image.
	 */
	export let value: string | null;
</script>

<Tooltip>
	<button
		slot="asChild"
		let:trigger
		use:melt={trigger}
		class="button square-40"
		aria-label="Select file"
		on:click={async () => {
			value = await getImageFromDisk();
		}}
	>
		<span class="block i-tabler-photo" aria-hidden />
	</button>
	<p slot="tooltip">Upload custom image</p>
</Tooltip>
