import type { PaletteColor } from '$lib/types/palette';

const HEX_PATTERN = /^#?[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string): string | null {
	const trimmed = value.trim();

	if (!HEX_PATTERN.test(trimmed)) {
		return null;
	}

	return `#${trimmed.replace('#', '').toUpperCase()}`;
}

export function slugifyThemeName(value: string): string {
	// Converting a free-form label into a predictable slug gives us a safe token
	// for CSS variable names and future URLs.
	return (
		value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'color-theme'
	);
}

export function createPalette(seed: string[]): PaletteColor[] {
	// This keeps the route simple: the page only says "make me a palette from
	// these starting colors" instead of rebuilding the object shape inline.
	return seed.map((hex, index) => ({
		id: index + 1,
		name: `Color ${index + 1}`,
		hex: normalizeHex(hex) ?? '#000000'
	}));
}

export function updatePaletteColor(
	palette: PaletteColor[],
	id: number,
	nextHex: string
): PaletteColor[] {
	const normalized = normalizeHex(nextHex);

	if (!normalized) {
		return palette;
	}

	// Returning a new array instead of mutating the existing one makes updates
	// predictable and works cleanly with reactive state.
	return palette.map((color) => (color.id === id ? { ...color, hex: normalized } : color));
}
