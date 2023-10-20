<script>
	import CodeMirror from '$lib/components/CodeMirror.svelte';
</script>

<main>
	<div class="border border-gray-6 border-solid shadow rounded-xl m-16 p-16" />

	<div class="frame p-16 bg-gray-10 overflow-hidden w-640 min-h-60">
		<CodeMirror />
	</div>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-columns: max(25%, 320px) 1fr;
		min-height: 100vh;
		height: 100%;
	}

	.frame {
		@include border-gradient;
		--p-border-radius: 0.5rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			var(--color-gray-3) 0%,
			var(--color-gray-8) 100%
		);

		padding: 1rem;
		background-color: var(--color-gray-10);
	}
</style>
