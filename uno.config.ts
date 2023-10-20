// uno.config.ts
import { DynamicMatcher, Rule, defineConfig } from 'unocss';

function pxToRem(num: number) {
	return `${num / 16}rem`;
}

const colorUtilities: Rule[] = [
	['color', 'color'],
	['bg', 'background-color'],
	['bc', 'border-color']
].map(([prefix, property]) => [
	new RegExp(`^${prefix}-(.+)$`),
	((match) => {
		const color = match[1];
		if (color.startsWith('rgb') || color.startsWith('#')) return { [property]: color };
		return { [property]: `var(--color-${match[1]});` };
	}) as DynamicMatcher
]);

const spacingUtilities: Rule[] = [
	['m', 'margin'],
	['mi', 'margin-inline'],
	['mis', 'margin-inline-start'],
	['mie', 'margin-inline-end'],
	['mblock', 'margin-block'],
	['mblck', 'margin-block'],
	['mk', 'margin-block'],
	['mbs', 'margin-block-start'],
	['mks', 'margin-block-start'],
	['mbe', 'margin-block-end'],
	['mke', 'margin-block-end'],
	['p', 'padding'],
	['pi', 'padding-inline'],
	['pis', 'padding-inline-start'],
	['pie', 'padding-inline-end'],
	['pblock', 'padding-block'],
	['pblck', 'padding-block'],
	['pk', 'padding-block'],
	['pbs', 'padding-block-start'],
	['pks', 'padding-block-start'],
	['pbe', 'padding-block-end'],
	['pke', 'padding-block-end'],
	['w', 'width'],
	['h', 'height'],
	['min-w', 'min-width'],
	['min-h', 'min-height'],
	['square', 'width', 'height'],
	['gap', 'gap']
].map(([prefix, ...properties]) => [
	new RegExp(`^${prefix}-(\\d+)$`),
	((match) => {
		const num = parseInt(match[1]);
		const value = Number.isNaN(num) ? match[1] : pxToRem(num);

		return Object.fromEntries(properties.map((property) => [property, value]));
	}) as DynamicMatcher
]);

export default defineConfig({
	rules: [...colorUtilities, ...spacingUtilities]
});
