import { DATABASE_URL } from '$env/static/private';
import { Pool } from 'pg';
import type { PaletteColor } from '$lib/types/palette';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool() {
	if (!DATABASE_URL) {
		throw new Error('DATABASE_URL is not configured.');
	}

	pool ??= new Pool({
		connectionString: DATABASE_URL,
		ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
	});

	return pool;
}

async function ensureSchema() {
	if (!schemaReady) {
		schemaReady = getPool().query(`
			CREATE TABLE IF NOT EXISTS color_themes (
				id text PRIMARY KEY,
				name text NOT NULL,
				slug text NOT NULL,
				version integer NOT NULL,
				export_filename text NOT NULL,
				colors jsonb NOT NULL,
				css_variables text NOT NULL,
				json_export jsonb NOT NULL,
				created_at timestamptz NOT NULL DEFAULT now(),
				updated_at timestamptz NOT NULL DEFAULT now()
			);

			CREATE INDEX IF NOT EXISTS color_themes_slug_idx ON color_themes (slug);
		`).then(() => undefined);
	}

	return schemaReady;
}

export type SavedTheme = {
	id: string;
	name: string;
	slug: string;
	version: number;
	exportFilename: string;
	colors: PaletteColor[];
	cssVariables: string;
	jsonExport: unknown;
	createdAt: string;
	updatedAt: string;
};

type ThemeRow = {
	id: string;
	name: string;
	slug: string;
	version: number;
	export_filename: string;
	colors: PaletteColor[];
	css_variables: string;
	json_export: unknown;
	created_at: Date;
	updated_at: Date;
};

function mapThemeRow(row: ThemeRow): SavedTheme {
	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		version: row.version,
		exportFilename: row.export_filename,
		colors: row.colors,
		cssVariables: row.css_variables,
		jsonExport: row.json_export,
		createdAt: row.created_at.toISOString(),
		updatedAt: row.updated_at.toISOString()
	};
}

export async function listColorThemes(): Promise<SavedTheme[]> {
	await ensureSchema();

	const result = await getPool().query<ThemeRow>(
		`SELECT id, name, slug, version, export_filename, colors, css_variables, json_export, created_at, updated_at
		 FROM color_themes
		 ORDER BY updated_at DESC, created_at DESC`
	);

	return result.rows.map(mapThemeRow);
}

export async function saveColorTheme({
	name,
	slug,
	colors,
	cssVariables,
	jsonExport
}: {
	name: string;
	slug: string;
	colors: PaletteColor[];
	cssVariables: string;
	jsonExport: unknown;
}): Promise<SavedTheme> {
	await ensureSchema();

	const client = await getPool().connect();

	try {
		await client.query('BEGIN');

		const versionResult = await client.query<{ version: number }>(
			'SELECT COALESCE(MAX(version), 0) + 1 AS version FROM color_themes WHERE slug = $1',
			[slug]
		);
		const version = Number(versionResult.rows[0]?.version ?? 1);
		const exportFilename = `${slug}${version > 1 ? `-v${version}` : ''}.json`;

		const result = await client.query<ThemeRow>(
			`INSERT INTO color_themes
				(id, name, slug, version, export_filename, colors, css_variables, json_export)
			 VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8::jsonb)
			 RETURNING id, name, slug, version, export_filename, colors, css_variables, json_export, created_at, updated_at`,
			[
				crypto.randomUUID(),
				name,
				slug,
				version,
				exportFilename,
				JSON.stringify(colors),
				cssVariables,
				JSON.stringify(jsonExport)
			]
		);

		await client.query('COMMIT');

		return mapThemeRow(result.rows[0]);
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function updateColorTheme(
	id: string,
	{
		name,
		slug,
		colors,
		cssVariables,
		jsonExport
	}: {
		name: string;
		slug: string;
		colors: PaletteColor[];
		cssVariables: string;
		jsonExport: unknown;
	}
): Promise<SavedTheme | null> {
	await ensureSchema();

	const existingResult = await getPool().query<{ version: number }>(
		'SELECT version FROM color_themes WHERE id = $1',
		[id]
	);

	if (!existingResult.rows[0]) {
		return null;
	}

	const version = existingResult.rows[0].version;
	const exportFilename = `${slug}${version > 1 ? `-v${version}` : ''}.json`;
	const result = await getPool().query<ThemeRow>(
		`UPDATE color_themes
		 SET name = $2,
			 slug = $3,
			 export_filename = $4,
			 colors = $5::jsonb,
			 css_variables = $6,
			 json_export = $7::jsonb,
			 updated_at = now()
		 WHERE id = $1
		 RETURNING id, name, slug, version, export_filename, colors, css_variables, json_export, created_at, updated_at`,
		[id, name, slug, exportFilename, JSON.stringify(colors), cssVariables, JSON.stringify(jsonExport)]
	);

	return result.rows[0] ? mapThemeRow(result.rows[0]) : null;
}
