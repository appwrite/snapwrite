<script lang="ts" context="module">
	export type ThemeSpec = Record<string, StyleSpec>;
	export type StyleSpec = {
		[propOrSelector: string]: string | number | StyleSpec | null;
	};

	type LanguageConfig = {
		label: string;
		highlighter: () => LanguageSupport;
	};

	export const languagePresets = {
		javascript: {
			label: 'Javascript',
			highlighter: javascript
		},
		typescript: {
			label: 'Typescript',
			highlighter: () => javascript({ typescript: true })
		},
		jsx: {
			label: 'JSX',
			highlighter: () => javascript({ jsx: true })
		},
		tsx: {
			label: 'TSX',
			highlighter: () => javascript({ jsx: true, typescript: true })
		},
		html: {
			label: 'HTML',
			highlighter: html
		},
		css: {
			label: 'CSS',
			highlighter: css
		},
		python: {
			label: 'Python',
			highlighter: python
		},
		php: {
			label: 'PHP',
			highlighter: php
		}
	} as const satisfies Record<string, LanguageConfig>;
	export type LanguagePreset = keyof typeof languagePresets;
</script>

<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap, placeholder as placeholderExt } from '@codemirror/view';
	import { EditorState, StateEffect, type Extension } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import {
		HighlightStyle,
		indentUnit,
		syntaxHighlighting,
		type LanguageSupport
	} from '@codemirror/language';
	import { debounce } from '$lib/utils/debounce.js';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { python } from '@codemirror/lang-python';
	import { php } from '@codemirror/lang-php';
	import { tags } from '@lezer/highlight';

	let classes = '';
	export { classes as class };
	export let value: string | null | undefined = '';

	export let basic = true;
	export let lang: LanguagePreset | null | undefined = undefined;
	export let extensions: Extension[] = [];

	export let useTab = true;
	export let tabSize = 2;

	export let lineWrapping = false;
	export let editable = true;
	export let readonly = false;
	export let placeholder: string | HTMLElement | null | undefined = undefined;

	const is_browser = typeof window !== 'undefined';
	const dispatch = createEventDispatcher<{ change: string }>();

	let element: HTMLDivElement;
	let view: EditorView;

	let update_from_prop = false;
	let update_from_state = false;
	let first_config = true;
	let first_update = true;

	$: state_extensions = [
		...get_base_extensions(
			basic,
			useTab,
			tabSize,
			lineWrapping,
			placeholder,
			editable,
			readonly,
			languagePresets[lang ?? 'javascript']?.highlighter()
		),
		syntaxHighlighting(
			HighlightStyle.define([
				{ tag: tags.moduleKeyword, color: '#9685FE' },
				{
					tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
					color: '#67A3FE'
				},
				{ tag: [tags.keyword, tags.tagName], color: '#fe86a8' },
				{ tag: tags.escape, color: '#67A3FE' },
				{ tag: tags.comment, color: '#6E6E71' },
				{ tag: tags.propertyName, color: '#67A3FE' },
				{ tag: tags.string, color: '#4AD4AB' }
			])
		),
		EditorView.theme({}, { dark: true }),
		...extensions
	];

	$: view && update(value);
	$: view && state_extensions && reconfigure();

	const obj = { a: 1, b: { c() {} } };
	obj.b.c();

	onMount(() => (view = create_editor_view()));
	onDestroy(() => view?.destroy());

	function create_editor_view(): EditorView {
		const on_change = debounce(handle_change, 300);

		return new EditorView({
			parent: element,
			state: create_editor_state(value),
			dispatch(transaction) {
				view.update([transaction]);

				if (!update_from_prop && transaction.docChanged) {
					on_change();
				}
			}
		});
	}

	function reconfigure(): void {
		if (first_config) {
			first_config = false;
			return;
		}

		view.dispatch({
			effects: StateEffect.reconfigure.of(state_extensions)
		});
	}

	function update(value: string | null | undefined): void {
		if (first_update) {
			first_update = false;
			return;
		}

		if (update_from_state) {
			update_from_state = false;
			return;
		}

		update_from_prop = true;

		view.setState(create_editor_state(value));

		update_from_prop = false;
	}

	function handle_change(): void {
		const new_value = view.state.doc.toString();
		if (new_value === value) return;

		update_from_state = true;

		value = new_value;
		dispatch('change', value);
	}

	function create_editor_state(value: string | null | undefined): EditorState {
		return EditorState.create({
			doc: value ?? undefined,
			extensions: state_extensions
		});
	}

	function get_base_extensions(
		basic: boolean,
		useTab: boolean,
		tabSize: number,
		lineWrapping: boolean,
		placeholder: string | HTMLElement | null | undefined,
		editable: boolean,
		readonly: boolean,
		lang: LanguageSupport | null | undefined
	): Extension[] {
		const extensions: Extension[] = [
			indentUnit.of(' '.repeat(tabSize)),
			EditorView.editable.of(editable),
			EditorState.readOnly.of(readonly)
		];

		if (basic) extensions.push(basicSetup);
		if (useTab) extensions.push(keymap.of([indentWithTab]));
		if (placeholder) extensions.push(placeholderExt(placeholder));
		if (lang) extensions.push(lang);
		if (lineWrapping) extensions.push(EditorView.lineWrapping);

		return extensions;
	}
</script>

{#if is_browser}
	<div class="codemirror-wrapper {classes}" bind:this={element} />
{:else}
	<div class="scm-waiting {classes}">
		<div class="scm-waiting__loading scm-loading">
			<div class="scm-loading__spinner" />
			<p class="scm-loading__text">Loading editor...</p>
		</div>

		<pre class="scm-pre cm-editor">{value}</pre>
	</div>
{/if}

<style lang="scss">
	.codemirror-wrapper :global(.cm-focused) {
		outline: none;
	}

	.scm-waiting {
		position: relative;
	}
	.scm-waiting__loading {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.5);
	}

	.scm-loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scm-loading__spinner {
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		border: solid 2px #000;
		border-top-color: transparent;
		margin-right: 0.75rem;
		animation: spin 1s linear infinite;
	}
	.scm-loading__text {
		font-family: sans-serif;
	}
	.scm-pre {
		font-size: 0.85rem;
		font-family: monospace;
		tab-size: 2;
		-moz-tab-size: 2;
		resize: none;
		pointer-events: none;
		user-select: none;
		overflow: auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.codemirror-wrapper {
		font-size: var(--p-font-size, 16px);

		:global(*) {
			font-family: 'Fira Code', monospace !important;
		}

		:global(.cm-gutters) {
			background-color: transparent;
			color: var(--color-greyscale-500);
			border-color: transparent;
			min-height: 0 !important;
		}

		:global(.cm-activeLineGutter) {
			background-color: transparent;
		}

		:global(.cm-cursor) {
			border-color: var(--color-primary);
		}

		:global(.cm-activeLine) {
			background-color: transparent;
		}
	}
</style>
