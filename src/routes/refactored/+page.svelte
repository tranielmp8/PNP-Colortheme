<script lang="ts">
	// Components are imported from `$lib/...`, which is SvelteKit's alias for
	// `src/lib`. This keeps imports short and avoids brittle `../../..` paths.
	import ColorColumn from '$lib/components/ColorColumn.svelte';
	import ExportPanel from '$lib/components/ExportPanel.svelte';
	import PalettePreview from '$lib/components/PalettePreview.svelte';
	import ThemeMetaForm from '$lib/components/ThemeMetaForm.svelte';
	import { copyTextToClipboard } from '$lib/utils/clipboard';
	import { createPalette, slugifyThemeName, updatePaletteColor } from '$lib/utils/color';
	import { buildCssVariables, buildPaletteJson, buildThemeGradient } from '$lib/utils/export';

	const initialPaletteSeed = ['#f94144', '#f8961e', '#f9c74f', '#90be6d', '#577590'];

	// The route owns the true source state for the page. Child components receive
	// pieces of this state as props and ask for changes via callbacks.
	let palette = $state(createPalette(initialPaletteSeed));
	let themeName = $state('Northern Current Refactored');
	let copiedKey = $state<string | null>(null);

	// These are derived values: they are computed from state instead of stored
	// separately, which avoids duplicate sources of truth.
	const themeSlug = $derived(slugifyThemeName(themeName));
	const themeGradient = $derived(buildThemeGradient(palette));
	const cssVariables = $derived(buildCssVariables(themeSlug, palette));
	const paletteJson = $derived(buildPaletteJson(themeName, palette));

	function handleHexChange(id: number, value: string) {
		palette = updatePaletteColor(palette, id, value);
	}

	function resetPalette() {
		palette = createPalette(initialPaletteSeed);
	}

	async function handleCopy(key: string, value: string) {
		const success = await copyTextToClipboard(value);

		if (!success) {
			return;
		}

		copiedKey = key;

		window.setTimeout(() => {
			if (copiedKey === key) {
				copiedKey = null;
			}
		}, 1800);
	}
</script>

<svelte:head>
	<title>Refactored Color Theme Template</title>
	<meta
		name="description"
		content="A refactored SvelteKit version of the color theme builder using components, utilities, and shared types."
	/>
</svelte:head>

<div class="page-shell">
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Refactored SvelteKit Version</p>
			<h1>Same color builder, cleaner architecture.</h1>
			<p class="intro">
				This page keeps the feature set from the prototype, but the responsibilities are split into
				reusable components and utility modules. Use it as the comparison version while you read the
				refactor guide.
			</p>
		</div>

		<div class="hero-actions">
			<button type="button" class="secondary" onclick={resetPalette}>Reset palette</button>
		</div>
	</section>

	<ThemeMetaForm bind:themeName themeSlug={themeSlug} />

	<PalettePreview
		palette={palette}
		themeGradient={themeGradient}
		copiedKey={copiedKey}
		oncopy={handleCopy}
	/>

	<section class="builder" aria-label="Refactored color builder">
		{#each palette as color}
			<!-- The route maps one data object to one `ColorColumn` component.
				This is the same loop as the prototype, but the rendering details
				now live in a dedicated file. -->
			<ColorColumn
				{color}
				{copiedKey}
				onhexchange={handleHexChange}
				oncopy={handleCopy}
			/>
		{/each}
	</section>

	<ExportPanel
		palette={palette}
		cssVariables={cssVariables}
		paletteJson={paletteJson}
		copiedKey={copiedKey}
		oncopy={handleCopy}
	/>
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

	.hero {
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
		background: rgba(7, 12, 20, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		backdrop-filter: blur(20px);
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

	.secondary {
		border: 1px solid transparent;
		border-radius: 999px;
		padding: 0.9rem 1.2rem;
		font: inherit;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.1);
		color: #f2f6fb;
	}

	.builder {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1rem;
	}

	@media (max-width: 1100px) {
		.builder {
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

		.builder {
			grid-template-columns: 1fr;
		}

		h1 {
			max-width: 100%;
		}
	}
</style>
