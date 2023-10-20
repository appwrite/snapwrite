<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';

	export let value: number = 0;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let label: string;

	const {
		elements: { root, range, thumb },
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

	<span use:melt={$root} class="relative flex h-20px w-200px items-center">
		<span class="block h-3px w-full bg-black">
			<span use:melt={$range} class="h-3px bg-white" />
		</span>
		<span
			use:melt={$thumb()}
			class="block square-12 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	</span>
</div>
