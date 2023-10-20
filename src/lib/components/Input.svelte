<script lang="ts">
	import { simpleUID } from '$lib/utils/simpleUID';
	import { createLabel, melt } from '@melt-ui/svelte';

	const {
		elements: { root }
	} = createLabel();

	export let label: string;

	export let value: number | undefined = undefined;
	export let id: string = simpleUID();
</script>

<label class="label block" use:melt={$root} for={id}>{label}</label>
<input bind:value type="number" />
