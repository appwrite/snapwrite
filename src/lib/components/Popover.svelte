<script lang="ts">
	import { createPopover, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { content, trigger },
		states: { open }
	} = createPopover({
		forceVisible: true
	});
</script>

<slot name="trigger" trigger={$trigger} />

{#if $open}
	<div class="z-100" use:melt={$content} transition:fly={{ duration: 150, y: -2 }}>
		<slot open={$open} />
	</div>
{/if}
