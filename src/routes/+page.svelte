<script lang="ts">
	import CodeMirror, { type LanguagePreset } from '$lib/components/CodeMirror.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import Select from '$lib/components/Select.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import { createPopover, melt, type SelectOption } from '@melt-ui/svelte';

	const langOptions: SelectOption<LanguagePreset>[] = [
		{
			value: 'typescript',
			label: 'Typescript'
		},
		{
			value: 'html',
			label: 'HTML'
		},
		{
			value: 'css',
			label: 'CSS'
		},
		{
			value: 'tsx',
			label: 'TSX'
		}
	];

	let lang: LanguagePreset = 'typescript';
	let fontSize = 16;
	let scale = 1;

	$: {
		// Reset scale when lang changes, otherwise CodeMirror bugs out
		lang;
		scale = 1;
	}
</script>

<main>
	<div class="toolbar flex flex-wrap items-baseline gap-32">
		<Select label="Background Image" options={[{ label: 'BG Dark 1', value: 'bg-1.png' }]} />
		<Select label="Language" options={langOptions} bind:value={lang} />
		<Slider label="Font Size" bind:value={fontSize} min={8} max={32} />
		<Slider label="Scale" bind:value={scale} min={0.1} max={3} step={0.1} />
		<Popover>
			<button
				slot="trigger"
				let:trigger
				class="button is-secondary mis-auto self-center"
				use:melt={trigger}>Export</button
			>

			<div class="exporter p-16">
				<div class="flex flex-col gap-16">
					<div class="flex justify-between items-center">
						<span class="font-500">SVG</span>

						<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8 rounded-1"
							>1x</button
						>
					</div>
					<div class="flex justify-between items-center">
						<span class="font-500">PNG</span>
						<div class="flex gap-2">
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8 rounded-l-1"
								>1x</button
							>
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8">2x</button>
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8 rounded-r-1"
								>3x</button
							>
						</div>
					</div>
					<div class="flex justify-between items-center">
						<span class="font-500">JPG</span>
						<div class="flex gap-2">
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8 rounded-l-1"
								>1x</button
							>
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8">2x</button>
							<button class="bg-greyscale-700/0.25 hover:bg-greyscale-700/0.5 p-6 pi-8 rounded-r-1"
								>3x</button
							>
						</div>
					</div>
				</div>
			</div>
		</Popover>
	</div>

	<div class="grid place-items-center grow w-full">
		<div class="frame">
			<div class="code-window" style:--p-scale={scale}>
				<div class="flex gap-8 mis-8">
					<div class="square-12 bg-#EC6A5E rounded-full" />
					<div class="square-12 bg-#F5BF4F rounded-full" />
					<div class="square-12 bg-#61C554 rounded-full" />
				</div>
				<div class="editor mbs-16">
					<CodeMirror
						--p-font-size="{fontSize}px"
						{lang}
						value={`import { Client, Account } from "appwrite";
const client = new Client()
	.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
	.setProject('<PROJECT_ID>');                 // Your project ID
	
const account = new Account(client);
	
const user = await account.create('[USER_ID]', 
'email@example.com', 'password');`}
					/>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	@mixin with-border-gradient {
		@include border-gradient;
		--p-border-radius: 1.25rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100vh;

		padding: 1rem;
		margin-inline: auto;
		min-width: 900px;
		max-width: 1440px;
	}

	.toolbar {
		width: 100%;

		padding-block-end: 1rem;
		border-bottom: 1px solid hsl(var(--color-white-hsl) / 0.125);
	}

	.frame {
		background: url('/images/bg-1.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		aspect-ratio: 1200 / 675;
		width: 100%;

		padding: 1rem;
		align-self: center;

		display: grid;
		place-items: center;

		.code-window {
			@include with-border-gradient;
			min-width: 500px;

			padding: 0.5rem;
			padding-block-start: 1rem;
			background-color: var(--color-greyscale-850);
			scale: var(--p-scale, 1);

			.editor {
				border-radius: 1rem;
				background: linear-gradient(112deg, rgba(0, 0, 0, 0.48) 26.01%, rgba(0, 0, 0, 0.06) 94.72%);
				min-height: 100px;
				overflow: hidden;
				padding: 2rem;
			}
		}
	}

	.exporter {
		@include with-border-gradient;
		--p-border-radius: 0.75rem;

		background-color: var(--color-subtle);
		min-width: 200px;
	}
</style>
