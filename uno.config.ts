// uno.config.ts
import { defineConfig } from 'unocss';

export default defineConfig({
	rules: [
		[
			/^color-(\w+)-(\d+)$/,
			(match) => {
				const num = parseInt(match[2]);
				if (num < 0 || num > 12) return;
				return { color: `var(--color-${match[1]}-${num})` };
			}
		],
		[
			/^bg-(\w+)-(\d+)$/,
			(match) => {
				const num = parseInt(match[2]);
				if (num < 0 || num > 12) return;
				return { ['background-color']: `var(--color-${match[1]}-${num})` };
			}
		]
	]
});
