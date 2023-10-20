<script>
	import CodeMirror from '$lib/components/CodeMirror.svelte';
</script>

<div class="grid place-items-center">
	<div class="frame p-4 bg-gray-8 overflow-hidden w-240 min-h-60">
		<CodeMirror />
	</div>
</div>

<style lang="scss">
	.frame {
		@include border-gradient;
		--p-border-radius: 0.5rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			var(--color-red-8) 0%,
			var(--color-red-3) 100%
		);
	}
</style>
