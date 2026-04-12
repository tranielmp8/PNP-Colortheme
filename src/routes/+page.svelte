<script lang="ts">
	type PaletteColumn = {
		id: number;
		name: string;
		hex: string;
	};

	const initialPalette = ['#f94144', '#f8961e', '#f9c74f', '#90be6d', '#577590'];

	let palette = $state<PaletteColumn[]>(initialPalette.map((hex, index) => ({
		id: index + 1,
		name: `Color ${index + 1}`,
		hex
	})));
	let themeName = $state('Northern Current');
	let copiedKey = $state<string | null>(null);

	const hexPattern = /^#?[0-9a-fA-F]{6}$/;

	function normalizeHex(value: string): string | null {
		const trimmed = value.trim();
		if (!hexPattern.test(trimmed)) {
			return null;
		}

		return `#${trimmed.replace('#', '').toUpperCase()}`;
	}

	function updateHex(id: number, value: string) {
		const normalized = normalizeHex(value);
		if (!normalized) {
			return;
		}

		palette = palette.map((column) =>
			column.id === id ? { ...column, hex: normalized } : column
		);
	}

	function resetPalette() {
		palette = initialPalette.map((hex, index) => ({
			id: index + 1,
			name: `Color ${index + 1}`,
			hex: hex.toUpperCase()
		}));
	}

	async function copyText(key: string, value: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) {
			return;
		}

		await navigator.clipboard.writeText(value);
		copiedKey = key;

		window.setTimeout(() => {
			if (copiedKey === key) {
				copiedKey = null;
			}
		}, 1800);
	}

	const themeGradient = $derived(palette.map((column) => column.hex).join(', '));
	const cssVariables = $derived.by(() =>
		`:root {\n${palette
			.map((column, index) => `  --${themeSlug}-${index + 1}: ${column.hex};`)
			.join('\n')}\n}`
	);
	const themeSlug = $derived(
		themeName
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'color-theme'
	);
	const paletteJson = $derived.by(() =>
		JSON.stringify(
			{
				name: themeName.trim() || 'Untitled Theme',
				colors: palette.map((column) => ({
					slot: column.name,
					hex: column.hex
				}))
			},
			null,
			2
		)
	);
</script>

<svelte:head>
	<title>Color Theme Template</title>
	<meta
		name="description"
		content="A five-column color theme template with draggable color pickers and synced hex code inputs."
	/>
</svelte:head>

<div class="page-shell">
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">SvelteKit Color Theme Template</p>
			<h1>Build a five-color palette by dragging, typing, and comparing live.</h1>
			<p class="intro">
				Each column includes a native color picker for the VS Code-style selector behavior, a live
				preview, and a hex input that stays in sync. You can drag the picker dot, paste a hex code,
				or copy the finished values from the footer row.
			</p>
		</div>

		<div class="hero-actions">
			<button type="button" class="secondary" onclick={resetPalette}>Reset palette</button>
		</div>
	</section>

	<section class="theme-meta" aria-label="Theme details">
		<label class="theme-name-field">
			<span>Theme name</span>
			<input
				type="text"
				bind:value={themeName}
				placeholder="Name this palette"
				aria-label="Theme name"
			/>
		</label>

		<div class="theme-meta__details">
			<div class="theme-meta__card">
				<span>Slug</span>
				<code>{themeSlug}</code>
			</div>
			<div class="theme-meta__card">
				<span>Status</span>
				<strong>{themeName.trim() || 'Untitled Theme'}</strong>
			</div>
		</div>
	</section>

	<section class="theme-preview" aria-label="Palette preview">
		<div class="theme-preview__swatches" style={`--theme-gradient: linear-gradient(135deg, ${themeGradient});`}>
			{#each palette as column}
				<div class="theme-preview__swatch">
					<span>{column.name}</span>
					<div class="swatch-copy">
						<strong>{column.hex}</strong>
						<button
							type="button"
							class="ghost"
							onclick={() => copyText(`swatch-${column.id}`, column.hex)}
						>
							{copiedKey === `swatch-${column.id}` ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="builder" aria-label="Color theme builder">
		{#each palette as column}
			<article class="color-column" style={`--column-color: ${column.hex};`}>
				<header>
					<p>{column.name}</p>
					<h2>{column.hex}</h2>
				</header>

				<div class="color-stage">
					<div class="color-stage__fill" aria-hidden="true"></div>
					<label class="picker-label">
						<span>Drag to adjust</span>
						<input
							type="color"
							value={column.hex}
							aria-label={`${column.name} picker`}
							oninput={(event) => updateHex(column.id, (event.currentTarget as HTMLInputElement).value)}
						/>
					</label>
				</div>

				<label class="hex-field">
					<span>Hex code</span>
					<input
						type="text"
						inputmode="text"
						spellcheck="false"
						value={column.hex}
						aria-label={`${column.name} hex code`}
						onchange={(event) => updateHex(column.id, (event.currentTarget as HTMLInputElement).value)}
						onblur={(event) => updateHex(column.id, (event.currentTarget as HTMLInputElement).value)}
					/>
				</label>

				<div class="column-footer">
					<span>Live output</span>
					<div class="footer-copy">
						<code>{column.hex}</code>
						<button
							type="button"
							class="ghost"
							onclick={() => copyText(`column-${column.id}`, column.hex)}
						>
							{copiedKey === `column-${column.id}` ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			</article>
		{/each}
	</section>

	<section class="output-panel" aria-label="Palette export">
		<div>
			<p class="eyebrow">Export</p>
			<h2>Theme hex codes</h2>
		</div>

		<div class="output-grid">
			{#each palette as column}
				<div class="output-chip">
					<span>{column.name}</span>
					<div class="footer-copy">
						<code>{column.hex}</code>
						<button
							type="button"
							class="ghost"
							onclick={() => copyText(`export-${column.id}`, column.hex)}
						>
							{copiedKey === `export-${column.id}` ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="code-exports" aria-label="Code exports">
		<article class="code-card">
			<div class="code-card__header">
				<div>
					<p class="eyebrow">CSS Variables</p>
					<h2>Paste into a stylesheet</h2>
				</div>
				<button type="button" class="secondary" onclick={() => copyText('css', cssVariables)}>
					{copiedKey === 'css' ? 'Copied CSS' : 'Copy CSS'}
				</button>
			</div>
			<pre>{cssVariables}</pre>
		</article>

		<article class="code-card">
			<div class="code-card__header">
				<div>
					<p class="eyebrow">JSON Preview</p>
					<h2>Reference object</h2>
				</div>
				<button type="button" class="secondary" onclick={() => copyText('json', paletteJson)}>
					{copiedKey === 'json' ? 'Copied JSON' : 'Copy JSON'}
				</button>
			</div>
			<pre>{paletteJson}</pre>
		</article>
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			'Segoe UI', 'Aptos', system-ui, sans-serif;
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.22), transparent 30%),
			linear-gradient(160deg, #08111f 0%, #10203a 45%, #152b45 100%);
		color: #f2f6fb;
	}

	.page-shell {
		min-height: 100vh;
		padding: 2rem;
		display: grid;
		gap: 1.5rem;
	}

	.hero,
	.theme-meta,
	.theme-preview,
	.output-panel,
	.code-card {
		background: rgba(7, 12, 20, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		backdrop-filter: blur(20px);
	}

	.hero {
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
	}

	.hero-copy {
		max-width: 56rem;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #a7c4ff;
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 4.5rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		max-width: 12ch;
	}

	.intro {
		margin-top: 1rem;
		max-width: 52rem;
		line-height: 1.6;
		color: rgba(242, 246, 251, 0.76);
	}

	.hero-actions {
		display: flex;
		align-items: center;
	}

	button {
		border: 1px solid transparent;
		border-radius: 999px;
		padding: 0.9rem 1.2rem;
		font: inherit;
		cursor: pointer;
	}

	.secondary {
		background: rgba(255, 255, 255, 0.1);
		color: #f2f6fb;
	}

	.ghost {
		padding: 0.45rem 0.8rem;
		font-size: 0.82rem;
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.08);
		color: #f2f6fb;
	}

	.theme-meta {
		padding: 1.25rem;
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 1rem;
		align-items: end;
	}

	.theme-name-field,
	.theme-meta__details {
		display: grid;
		gap: 0.75rem;
	}

	.theme-name-field span,
	.theme-meta__card span {
		font-size: 0.82rem;
		color: rgba(242, 246, 251, 0.76);
	}

	.theme-name-field input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 16px;
		padding: 1rem 1.1rem;
		background: rgba(255, 255, 255, 0.06);
		color: #f2f6fb;
		font: inherit;
	}

	.theme-meta__details {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.theme-meta__card {
		padding: 1rem;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.06);
		display: grid;
		gap: 0.45rem;
	}

	.theme-preview {
		padding: 1rem;
	}

	.theme-preview__swatches {
		--theme-gradient: linear-gradient(135deg, #f94144, #f8961e, #f9c74f, #90be6d, #577590);
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 18px;
		background: var(--theme-gradient);
	}

	.theme-preview__swatch {
		min-height: 6rem;
		padding: 1rem;
		border-radius: 16px;
		background: rgba(6, 10, 18, 0.45);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.swatch-copy,
	.footer-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.theme-preview__swatch span,
	.hex-field span,
	.picker-label span,
	.column-footer span,
	.output-chip span {
		font-size: 0.82rem;
		color: rgba(242, 246, 251, 0.76);
	}

	.builder {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1rem;
	}

	.color-column {
		--column-color: #ffffff;
		display: grid;
		grid-template-rows: auto 1fr auto auto;
		gap: 1rem;
		padding: 1rem;
		min-height: 31rem;
		border-radius: 24px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.15), transparent 22%),
			radial-gradient(circle at top, color-mix(in srgb, var(--column-color) 45%, white), transparent 45%),
			rgba(7, 12, 20, 0.78);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 20px 45px rgba(0, 0, 0, 0.22);
	}

	.color-column header {
		display: grid;
		gap: 0.35rem;
	}

	.color-column header p {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.75rem;
		color: rgba(242, 246, 251, 0.64);
	}

	.color-stage {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: 1rem;
	}

	.color-stage__fill {
		border-radius: 18px;
		min-height: 16rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 30%),
			var(--column-color);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.24),
			0 16px 30px rgba(0, 0, 0, 0.16);
	}

	.picker-label,
	.hex-field {
		display: grid;
		gap: 0.55rem;
	}

	.picker-label input[type='color'] {
		width: 100%;
		height: 3.5rem;
		padding: 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
		cursor: pointer;
	}

	.picker-label input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.picker-label input[type='color']::-webkit-color-swatch {
		border: 0;
		border-radius: 10px;
	}

	.hex-field input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 14px;
		padding: 0.9rem 1rem;
		background: rgba(255, 255, 255, 0.06);
		color: #f2f6fb;
		font: inherit;
		text-transform: uppercase;
	}

	.column-footer,
	.output-chip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
	}

	code {
		font-family: 'Cascadia Code', 'Consolas', monospace;
		font-size: 0.95rem;
		color: #ffffff;
	}

	.output-panel {
		padding: 1.25rem;
		display: grid;
		gap: 1rem;
	}

	.output-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.code-exports {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.code-card {
		padding: 1.25rem;
		display: grid;
		gap: 1rem;
	}

	.code-card__header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}

	pre {
		margin: 0;
		padding: 1rem;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.06);
		overflow-x: auto;
		font-family: 'Cascadia Code', 'Consolas', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #f2f6fb;
	}

	@media (max-width: 1100px) {
		.theme-meta,
		.builder,
		.code-exports,
		.output-grid,
		.theme-preview__swatches {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.hero {
			flex-direction: column;
			align-items: start;
		}
	}

	@media (max-width: 700px) {
		.page-shell {
			padding: 1rem;
		}

		.theme-meta,
		.theme-meta__details,
		.builder,
		.code-exports,
		.output-grid,
		.theme-preview__swatches {
			grid-template-columns: 1fr;
		}

		.color-column {
			min-height: auto;
		}

		h1 {
			max-width: 100%;
		}
	}
</style>
