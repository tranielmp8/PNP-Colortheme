import type { PaletteColor, PaletteJsonExport } from '$lib/types/palette';

export function buildThemeGradient(palette: PaletteColor[]): string {
	return palette.map((color) => color.hex).join(', ');
}

export function buildCssVariables(themeSlug: string, palette: PaletteColor[]): string {
	// Export formatting is kept outside the route so the page can focus on state
	// and composition instead of string-building details.
	const lines = palette.map((color, index) => `  --${themeSlug}-${index + 1}: ${color.hex};`);
	return `:root {\n${lines.join('\n')}\n}`;
}

export function buildPaletteJson(themeName: string, palette: PaletteColor[]): string {
	const payload: PaletteJsonExport = {
		name: themeName.trim() || 'Untitled Theme',
		colors: palette.map((color) => ({
			slot: color.name,
			hex: color.hex
		}))
	};

	return JSON.stringify(payload, null, 2);
}
