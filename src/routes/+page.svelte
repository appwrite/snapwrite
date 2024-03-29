<script lang="ts">
	import CodeMirror, {
		languagePresets,
		type LanguagePreset
	} from '$lib/components/CodeMirror.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import ImageInput from '$lib/components/ImageInput.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import Select from '$lib/components/Select.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { IS_DEV } from '$lib/constants';
	import { save, toImage } from '$lib/utils/toImage';
	import { melt, type SelectOption } from '@melt-ui/svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	// Options
	const langOptions = Object.entries(languagePresets).map(([key, { label }]) => ({
		label,
		value: key
	})) as SelectOption<LanguagePreset>[];
	let lang: LanguagePreset = 'typescript';

	const ratios: SelectOption<string>[] = [
		{
			label: 'Square',
			value: '1'
		},
		{
			label: 'Twitter (One Image)',
			value: '2400/1350'
		},
		{
			label: 'Twitter (Two Images)',
			value: '2800/3200'
		},
		{
			label: 'Product Hunt (Gallery)',
			value: '2540/1520'
		},
		{
			label: 'Dribble',
			value: '2800/2100'
		},
		{
			label: 'Instagram (Portrait)',
			value: '1080/1350'
		},
		{
			label: 'Stories (IG, LinkedIn)',
			value: '1080/1920'
		}
	];
	let ratio = ratios[0].value;

	let fontSize = 16;
	let scale = 1;

	const bgOptions: SelectOption<string>[] = [
		{ label: 'BG Dark 1', value: 'bg-1.png' },
		{ label: 'Custom', value: 'custom' }
	];

	let bg = bgOptions[0].value;
	let customBg: string | null = null;

	// Debug Info
	$: trueRatio = (() => {
		const [w, h] = ratio.split('/').map(Number);
		return (w / (h ?? 1)).toFixed(2);
	})();

	let frameRatio = '1.00';

	const getFrameRatio = (frame: HTMLElement | undefined) => {
		if (!frame) return '0.00';
		const { width, height } = frame.getBoundingClientRect();
		return (width / height).toFixed(2);
	};

	$: {
		ratio;
		tick().then(() => {
			frameRatio = getFrameRatio(frame);
		});
	}

	// Exporter
	let frame: HTMLElement;
	let capturing = false;
	let url = '';

	type ExporterArgs = {
		format: 'svg' | 'png' | 'jpg';
		size?: number;
		copy?: boolean;
	};

	function exporter({ format, size = 1, copy = false }: ExporterArgs) {
		return () => {
			if (capturing) return;
			const promise = new Promise((resolve, reject) => {
				(async () => {
					try {
						if (capturing) {
							throw new Error('Already capturing');
						}
						capturing = true;

						const { dataUrl } = await toImage(frame, format, size);

						if (copy) {
							const blob = await fetch(dataUrl).then((res) => res.blob());
							const item = new ClipboardItem({ [blob.type]: blob });
							navigator.clipboard.write([item]);
						} else {
							save(dataUrl);
						}

						resolve(dataUrl);
					} catch (err) {
						reject(err);
					} finally {
						capturing = false;
					}
				})();
			});

			toast.promise(promise, {
				loading: 'Generating image...',
				success: copy ? 'Copied!' : 'Downloaded!',
				error: 'Failed to export. Please try again.'
			});
		};
	}

	let hideSidebar = false;
</script>

<main>
	<div class="toolbar" data-hide={hideSidebar}>
		<div
			class="flex flex-col flex-wrap items-stretch gap-1rem transition"
			style:opacity={hideSidebar ? 0 : 1}
		>
			<Combobox label="Language" options={langOptions} bind:value={lang} />
			<Slider label="Font Size" bind:value={fontSize} min={8} max={32} />
			<Slider label="Scale" bind:value={scale} min={0.5} max={2} step={0.1} />
			<Select label="Ratio" options={ratios} bind:value={ratio} --p-min-w="14rem" />

			<div class="flex items-center gap-4">
				<Select label="Background Image" options={bgOptions} bind:value={bg} />

				{#if bg === 'custom'}
					<div class="self-end" transition:fly={{ duration: 150, y: 4 }}>
						<ImageInput bind:value={customBg} />
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-8">
				{#each ['Export', 'Copy'] as act}
					<Popover>
						<button slot="trigger" let:trigger class="button is-secondary" use:melt={trigger}>
							{act}
						</button>

						<div class="exporter p-16">
							<div class="flex flex-col gap-16">
								{#if act === 'Export'}
									<div class="flex justify-between items-center">
										<span class="font-500">SVG</span>

										<button
											disabled={capturing}
											class="rounded-4"
											on:click={exporter({ format: 'svg' })}>1x</button
										>
									</div>
								{/if}

								<div class="flex justify-between items-center">
									<span class="font-500">PNG</span>
									<div class="flex gap-2">
										<button
											disabled={capturing}
											class="rounded-l-4"
											on:click={exporter({ copy: act === 'Copy', format: 'png' })}>1x</button
										>
										<button
											disabled={capturing}
											on:click={exporter({ copy: act === 'Copy', format: 'png', size: 2 })}
											>2x</button
										>
										<button
											disabled={capturing}
											class="rounded-r-4"
											on:click={exporter({ copy: act === 'Copy', format: 'png', size: 3 })}
											>3x</button
										>
									</div>
								</div>

								{#if act === 'Export'}
									<div class="flex justify-between items-center">
										<span class="font-500">JPG</span>
										<div class="flex gap-2">
											<button
												disabled={capturing}
												class="rounded-l-4"
												on:click={exporter({ format: 'jpg' })}>1x</button
											>
											<button disabled={capturing} on:click={exporter({ format: 'jpg', size: 2 })}
												>2x</button
											>
											<button
												disabled={capturing}
												class="rounded-r-4"
												on:click={exporter({ format: 'jpg', size: 3 })}>3x</button
											>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</Popover>
				{/each}
			</div>
		</div>

		<Tooltip>
			<button
				slot="asChild"
				let:trigger
				use:melt={trigger}
				class="button !absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 !p-10"
				on:click={() => (hideSidebar = !hideSidebar)}
			>
				<div class="i-tabler-chevron-left transition duration-200" class:rotate-180={hideSidebar} />
			</button>
			<p slot="tooltip">{hideSidebar ? 'Expand' : 'Collapse'} Sidebar</p>
		</Tooltip>
	</div>

	<img src={url} alt="" srcset="" />

	<div class="grow self-stretch overflow-hidden relative">
		<!-- Debug Info -->
		<div
			class="absolute right-16 top-16 font-mono text-12 p-8 bg-black/0.25 rounded-4 z-1"
			class:hidden={!IS_DEV}
		>
			<p>Ratio: {ratio}</p>
			<p>True Ratio: {trueRatio}</p>
			<br />

			{#key frameRatio}
				<p>Image Width: {frame?.getBoundingClientRect().width.toFixed(2)}</p>
				<p>Image Height: {frame?.getBoundingClientRect().height.toFixed(2)}</p>
				<p>Image ratio: {frameRatio}</p>
				<br />

				<div class="flex items-center gap-2">
					<span>Fulfils ratio: </span>
					<span
						class="inline-block text-16
						{trueRatio === frameRatio ? 'i-tabler-check bg-mint-500' : 'i-tabler-x bg-red-500'}"
					/>
				</div>
			{/key}
		</div>
		<div
			class="frame grow relative"
			bind:this={frame}
			style:--p-ratio={ratio}
			style:--p-resize={capturing ? 'none' : 'both'}
			style:--p-bg="url({bg === 'custom' ? customBg : `/images/${bg}`})"
		>
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
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('<PROJECT_ID>');                
	
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

		align-items: center;
		gap: 1rem;
		height: 100vh;

		padding: 1rem;
		margin-inline: auto;
		min-width: 900px;
		max-width: 1440px;

		position: relative;
	}

	.toolbar {
		@include with-border-gradient;
		--p-border-radius: 0rem;

		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		padding: 1.5rem;
		--p-margin: 0rem;
		height: calc(100% - var(--p-margin) * 2);
		width: 20rem;

		background-color: hsl(var(--color-greyscale-900-hsl) / 1);

		transition: 150ms ease;

		&[data-hide='true'] {
			translate: -18rem;
		}
	}

	.frame {
		background: var(--p-bg, url('/images/bg-1.png'));
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 1rem;

		aspect-ratio: var(--p-ratio);

		max-width: 100%;
		max-height: 100%;

		padding: 1rem;
		align-self: center;

		display: grid;
		place-items: center;
		margin-inline: auto;

		overflow: hidden;

		.code-window {
			@include with-border-gradient;
			// min-width: 500px;

			padding: 0.5rem;
			padding-block-start: 1rem;
			background-color: var(--color-greyscale-850);
			scale: var(--p-scale, 1);

			.editor {
				border-radius: 1rem;
				background: rgba(0, 0, 0, 0.48);
				min-height: 100px;
				overflow: hidden;
				padding: 2rem;

				resize: var(--p-resize);
			}
		}
	}

	.exporter {
		@include with-border-gradient;
		--p-border-radius: 0.75rem;

		background-color: var(--color-subtle);
		min-width: 200px;

		button {
			background-color: hsl(var(--color-greyscale-700-hsl) / 0.25);
			padding: 0.375rem;
			padding-inline: 0.5rem;

			&:hover {
				background-color: hsl(var(--color-greyscale-700-hsl) / 0.5);
			}
		}
	}
</style>
