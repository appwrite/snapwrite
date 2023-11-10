<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
	import { fly, type FlyParams } from 'svelte/transition';

	export let placement: NonNullable<FloatingConfig>['placement'] = 'top';
	export let disabled = false;
	export let closeOnPointerDown = true;

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement
		},
		openDelay: 500,
		closeOnPointerDown,
		forceVisible: true
	});

	$: flyParams = (function getFlyParams() {
		const params: FlyParams = {
			duration: 150
		};

		switch (placement) {
			case 'top':
			case 'top-start':
			case 'top-end':
				params.y = 4;
				break;
			case 'bottom':
			case 'bottom-start':
			case 'bottom-end':
				params.y = -4;
				break;

			case 'left':
			case 'left-start':
			case 'left-end':
				params.x = 4;
				break;
			case 'right':
			case 'right-start':
			case 'right-end':
				params.x = -4;
				break;
		}

		return params;
	})();
</script>

<slot name="asChild" trigger={$trigger} />

{#if !$$slots.asChild}
	<span use:melt={$trigger}>
		<slot />
	</span>
{/if}

{#if $open && !disabled}
	<div use:melt={$content} class="tooltip" transition:fly={flyParams}>
		<div use:melt={$arrow} />
		<slot name="tooltip" />
	</div>
{/if}

<style lang="scss">
	.tooltip {
		--p-tooltip-bg: rgba(47, 48, 49, 1);
		--p-tooltip-color: rgba(228, 228, 231, 1);

		font-size: 1rem;
		color: var(--p-tooltip-color);
		background-color: var(--p-tooltip-bg);
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		backdrop-filter: blur(1rem);
		-webkit-backdrop-filter: blur(1rem);
		box-shadow: 0 1px 20px 3px rgb(0 0 0 / 0.1);
		z-index: 999;
	}
</style>
