// Shared data shapes live here so components, routes, and utilities all agree
// on what a palette item and exported theme should look like.
export type PaletteColor = {
	id: number;
	name: string;
	hex: string;
};

export type PaletteExportColor = {
	slot: string;
	hex: string;
};

export type PaletteJsonExport = {
	name: string;
	slug: string;
	colors: PaletteExportColor[];
};
