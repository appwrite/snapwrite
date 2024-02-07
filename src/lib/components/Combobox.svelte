<script lang="ts" context="module">
	export type ComboboxOption<T = unknown> = {
		value: T;
		label?: string;
		icon?: string;
		group?: string;
	};
</script>

<script lang="ts">
	import { createCombobox, melt, type CreateSelectProps } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly, type FlyParams } from 'svelte/transition';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let options: Array<ComboboxOption<any>>;

	export let value: unknown | undefined = undefined;
	export let onSelectedChange: CreateSelectProps['onSelectedChange'] = undefined;

	export let preventScroll = false;
	export let placement: NonNullable<CreateSelectProps['positioning']>['placement'] = 'bottom';
	export let label: string;

	const dispatch = createEventDispatcher<{
		change: unknown;
	}>();

	const {
		elements: { input, menu, option: optionEl, group: groupEl, groupLabel, label: labelEl },
		states: { open, selected, inputValue, touchedInput }
	} = createCombobox<unknown>({
		preventScroll,
		positioning: {
			sameWidth: true,
			fitViewport: true,
			placement
		},
		forceVisible: true,
		onSelectedChange({ curr, next }) {
			if (onSelectedChange) {
				next = onSelectedChange({ curr, next });
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

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	const DEFAULT_GROUP = 'default';
	type Group = {
		label: string;
		options: ComboboxOption<unknown>[];
	};
	$: groups = (function getGroups(): Group[] {
		const groups = options.reduce<Record<string, ComboboxOption[]>>((carry, option) => {
			if ($touchedInput && !option.label?.toLowerCase().includes($inputValue.toLowerCase() ?? '')) {
				return carry;
			}

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

	<div class="relative w-fit">
		<input use:melt={$input} />
		<div
			class="i-tabler-chevron-down absolute right-8 top-1/2 z-10 -translate-y-1/2 pointer-events-none"
			aria-hidden="true"
		/>
	</div>
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
							<div class="icon i-tabler-check" />
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
	[data-melt-combobox-input] {
		background-color: var(--color-greyscale-800);
		border: 1px solid var(--color-offset);
		border-radius: 0.5rem;
		padding: 0.6rem 0.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		font-size: 1rem;

		min-width: var(--p-min-w, 10rem);

		transition: 150ms ease;

		&:hover {
			background-color: hsl(var(--color-greyscale-800-hsl) / 0.75);
			/* border-color: var(--color-primary); */
		}

		&:active {
			background-color: hsl(var(--color-greyscale-800-hsl) / 0.5);
			/* border-color: var(--color-primary); */
		}

		&:focus {
			border-color: hsl(var(--color-pink-500-hsl) / 0.5);
		}
	}

	[data-melt-combobox-menu] {
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

	[data-melt-combobox-option] {
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

		.icon {
			position: absolute;
			right: 0.5rem;
			top: 50%;
			translate: 0 -50%;
			opacity: 0;
		}

		&[data-selected] .icon {
			opacity: 1;
		}
	}
</style>
