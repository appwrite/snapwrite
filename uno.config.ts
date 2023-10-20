// uno.config.ts
import { DynamicMatcher, Rule, defineConfig } from 'unocss';

function isValidColorNum(match: RegExpMatchArray) {
	const num = parseInt(match[2]);
	return num >= 0 && num <= 12;
}

function pxToRem(num: number) {
	return `${num / 16}rem`;
}

const colorUtilities: Rule[] = [
	['color', 'color'],
	['bg', 'background-color'],
	['border', 'border-color']
].map(([prefix, property]) => [
	new RegExp(`^${prefix}-(\\w+)-(\\d+)$`),
	((match) => {
		if (!isValidColorNum(match)) return false;
		return { [property]: `var(--color-${match[1]}-${match[2]})` };
	}) as DynamicMatcher
]);

const spacingUtilities: Rule[] = [
	['m', 'margin'],
	['mi', 'margin-inline'],
	['mis', 'margin-inline-start'],
	['mie', 'margin-inline-end'],
	['mk', 'margin-block'],
	['mks', 'margin-block-start'],
	['mke', 'margin-block-end'],
	['p', 'padding'],
	['pi', 'padding-inline'],
	['pis', 'padding-inline-start'],
	['pie', 'padding-inline-end'],
	['pk', 'padding-block'],
	['pks', 'padding-block-start'],
	['pke', 'padding-block-end'],
	['w', 'width'],
	['h', 'height'],
	['min-w', 'min-width'],
	['min-h', 'min-height']
].map(([prefix, property]) => [
	new RegExp(`^${prefix}-(\\d+)$`),
	((match) => {
		const num = parseInt(match[1]);
		return { [property]: pxToRem(num) };
	}) as DynamicMatcher
]);

export default defineConfig({
	rules: [...colorUtilities, ...spacingUtilities]
});
