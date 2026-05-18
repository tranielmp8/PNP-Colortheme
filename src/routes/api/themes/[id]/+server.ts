import { json, type RequestHandler } from '@sveltejs/kit';
import { normalizeHex, slugifyThemeName } from '$lib/utils/color';
import { buildPaletteJson } from '$lib/utils/export';
import { updateColorTheme } from '$lib/server/themes';
import type { PaletteColor } from '$lib/types/palette';

type UpdateThemeRequest = {
	name?: unknown;
	slug?: unknown;
	colors?: unknown;
	cssVariables?: unknown;
	jsonExport?: unknown;
};

function parsePalette(value: unknown): PaletteColor[] {
	if (!Array.isArray(value) || value.length === 0) {
		throw new Error('Palette must include at least one color.');
	}

	return value.map((item, index) => {
		if (!item || typeof item !== 'object') {
			throw new Error('Palette colors must be objects.');
		}

		const color = item as Partial<PaletteColor>;
		const normalizedHex = normalizeHex(String(color.hex ?? ''));

		if (!normalizedHex) {
			throw new Error(`Color ${index + 1} needs a valid 6-digit hex value.`);
		}

		return {
			id: Number(color.id ?? index + 1),
			name: String(color.name ?? `Color ${index + 1}`),
			hex: normalizedHex
		};
	});
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		if (!params.id) {
			return json({ message: 'Color theme id is required.' }, { status: 400 });
		}

		const body = (await request.json()) as UpdateThemeRequest;
		const name = String(body.name ?? '').trim() || 'Untitled Theme';
		const slug = slugifyThemeName(String(body.slug ?? name));
		const colors = parsePalette(body.colors);
		const cssVariables = String(body.cssVariables ?? '');
		const jsonExport =
			body.jsonExport && typeof body.jsonExport === 'object'
				? body.jsonExport
				: JSON.parse(buildPaletteJson(name, slug, colors));

		const savedTheme = await updateColorTheme(params.id, {
			name,
			slug,
			colors,
			cssVariables,
			jsonExport
		});

		if (!savedTheme) {
			return json({ message: 'Color theme was not found.' }, { status: 404 });
		}

		return json(savedTheme);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to update color theme.';
		return json({ message }, { status: 400 });
	}
};
