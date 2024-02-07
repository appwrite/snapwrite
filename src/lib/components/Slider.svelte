<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';

	export let value: number = 0;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let label: string;

	const {
		elements: { root, range, thumbs },
		states: { value: localValue }
	} = createSlider({
		min,
		max,
		step,
		defaultValue: [value],
		onValueChange({ next }) {
			value = next[0];
			return next;
		}
	});

	$: localValue.set([value]);
</script>

<div>
	<div class="flex justify-between">
		<span class="label">{label}</span>
		<span class="label">{value}</span>
	</div>

	<span use:melt={$root} class="relative flex h-20px w-full items-center">
		<span class="block h-3px w-full bg-black">
			<span use:melt={$range} class="h-3px bg-white" />
		</span>
		{#each $thumbs as thumb}
			<span
				use:melt={thumb}
				class="block square-12 rounded-full bg-white outline-none focus:ring-4 ring-[hsl(var(--color-pink-600-hsl))]"
			/>
		{/each}
	</span>
</div>
