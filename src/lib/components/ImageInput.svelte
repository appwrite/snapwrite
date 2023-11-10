<script lang="ts">
	import { getImageFromDisk } from '$lib/utils/getImageFromDisk';

	/**
	 * Represents a base64 encoded image.
	 */
	export let value: string | null;
</script>

<button
	class="button square-40"
	aria-label="Select file"
	on:click={async () => {
		value = await getImageFromDisk();
	}}
>
	<span class="block i-tabler-photo" aria-hidden />
</button>
