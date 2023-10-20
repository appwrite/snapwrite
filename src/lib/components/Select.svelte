<script lang="ts" context="module">
	export type SelectOption<T = unknown> = {
		value: T;
		label?: string;
		icon?: string;
		group?: string;
	};
</script>

<script lang="ts">
	import { createSelect, melt, type CreateSelectProps } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly, type FlyParams } from 'svelte/transition';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let options: Array<SelectOption<any>>;

	export let value: unknown | undefined = undefined;
	export let onSelectedChange: CreateSelectProps['onSelectedChange'] = undefined;

	export let preventScroll = false;
	export let placement: NonNullable<CreateSelectProps['positioning']>['placement'] = 'bottom';
	export let label: string;

	const dispatch = createEventDispatcher<{
		change: unknown;
	}>();

	const {
		elements: { trigger, menu, option: optionEl, group: groupEl, groupLabel, label: labelEl },
		states: { open, selected, selectedLabel }
	} = createSelect<unknown>({
		preventScroll,
		positioning: {
			sameWidth: true,
			fitViewport: true,
			placement
		},
		forceVisible: true,
		onSelectedChange({ curr, next }) {
			if (onSelectedChange) {
				onSelectedChange({ curr, next });
			}
			value = next?.value;
			dispatch('change', next?.value);

			return next;
		},
		defaultSelected: value ? undefined : options[0]
	});

	$: selectedOption = options.find((o) => o.value === value);

	$: if (selectedOption) {
		selected.set(selectedOption);
	}

	const DEFAULT_GROUP = 'default';
	type Group = {
		label: string;
		options: SelectOption<unknown>[];
	};
	$: groups = (function getGroups(): Group[] {
		const groups = options.reduce<Record<string, SelectOption[]>>((carry, option) => {
			const group = option.group ?? DEFAULT_GROUP;
			if (!carry[group]) {
				carry[group] = [];
			}
			carry[group].push(option);
			return carry;
		}, {});

		return Object.entries(groups).map(([label, options]) => ({ label, options }));
	})();

	$: flyParams = {
		duration: 150,
		y: placement === 'top' ? 4 : -4
	} as FlyParams;
</script>

<div>
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="block label" use:melt={$labelEl}>{label}</label>

	<button use:melt={$trigger} aria-label="Select theme">
		{#if selectedOption?.icon}
			<span class="{selectedOption.icon} pointer-events-none" aria-hidden="true" />
		{/if}
		<span class="pointer-events-none select-none">{$selectedLabel}</span>

		<div class="i-tabler-chevron-down pointer-events-none" aria-hidden="true" />
	</button>
</div>

{#if $open}
	<div style:z-index={10000} use:melt={$menu} transition:fly={flyParams}>
		{#each groups as group}
			{@const isDefault = group.label === DEFAULT_GROUP}
			{#if isDefault}
				<div class="flex flex-col">
					{#each group.options as option}
						<button use:melt={$optionEl(option)}>
							{#if option.icon}
								<span class={option.icon} aria-hidden="true" />
							{/if}
							<span class="capitalize">{option.label}</span>
							<div class="i-tabler-check" />
						</button>
					{/each}
				</div>
			{:else}
				<div use:melt={$groupEl(group.label)}>
					<span use:melt={$groupLabel(group.label)}>
						{group.label}
					</span>

					{#each group.options as option}
						<button use:melt={$optionEl(option)}>
							{#if option.icon}
								<span class={option.icon} aria-hidden="true" />
							{/if}
							<span class="capitalize">{option.label}</span>
						</button>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style lang="scss">
	[data-melt-select-trigger] {
		@include border-gradient;
		--p-border-radius: 0.5rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);

		background: hsl(var(--color-white-hsl) / 0.08);
		padding: 0.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		min-width: 10rem;

		transition: 150ms ease;

		&:hover {
			background: hsl(var(--color-white-hsl) / 0.12);
		}

		&:active {
			background: hsl(var(--color-white-hsl) / 0.1);
		}
	}

	[data-melt-select-menu] {
		@include border-gradient;
		--p-border-radius: 0.5rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);

		background-color: var(--color-greyscale-850);
		padding: 0.5rem;
	}

	[data-melt-select-option] {
		all: unset;
		text-align: left;

		padding: 0.5rem;
		font-size: 0.875rem;
		border-radius: 0.3rem;

		position: relative;

		&:hover {
			background-color: hsl(var(--color-greyscale-700-hsl) / 0.375);
		}

		&[data-highlighted] {
			background-color: hsl(var(--color-greyscale-700-hsl) / 0.25);
		}

		[class*='i-'] {
			position: absolute;
			right: 0.5rem;
			top: 50%;
			translate: 0 -50%;
			opacity: 0;
		}

		&[data-selected] [class*='i-'] {
			opacity: 1;
		}
	}
</style>
