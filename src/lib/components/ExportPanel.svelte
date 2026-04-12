<script lang="ts">
	import CopyButton from '$lib/components/CopyButton.svelte';
	import type { PaletteColor } from '$lib/types/palette';

	let {
		palette,
		cssVariables,
		paletteJson,
		copiedKey,
		oncopy
	}: {
		palette: PaletteColor[];
		cssVariables: string;
		paletteJson: string;
		copiedKey: string | null;
		oncopy: (key: string, value: string) => void;
	} = $props();
</script>

<section class="output-panel" aria-label="Palette export">
	<!-- ExportPanel only renders already-prepared values.
		The route computes the CSS and JSON strings before passing them in. -->
	<div>
		<p class="eyebrow">Export</p>
		<h2>Theme hex codes</h2>
	</div>

	<div class="output-grid">
		{#each palette as color}
			<div class="output-chip">
				<span>{color.name}</span>
				<div class="footer-copy">
					<code>{color.hex}</code>
					<CopyButton
						label="Copy"
						copiedLabel="Copied"
						isCopied={copiedKey === `export-${color.id}`}
						oncopy={() => oncopy(`export-${color.id}`, color.hex)}
					/>
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
			<CopyButton
				label="Copy CSS"
				copiedLabel="Copied CSS"
				isCopied={copiedKey === 'css'}
				oncopy={() => oncopy('css', cssVariables)}
			/>
		</div>
		<pre>{cssVariables}</pre>
	</article>

	<article class="code-card">
		<div class="code-card__header">
			<div>
				<p class="eyebrow">JSON Preview</p>
				<h2>Reference object</h2>
			</div>
			<CopyButton
				label="Copy JSON"
				copiedLabel="Copied JSON"
				isCopied={copiedKey === 'json'}
				oncopy={() => oncopy('json', paletteJson)}
			/>
		</div>
		<pre>{paletteJson}</pre>
	</article>
</section>

<style>
	.output-panel,
	.code-card {
		background: rgba(7, 12, 20, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		backdrop-filter: blur(20px);
	}

	.output-panel {
		padding: 1.25rem;
		display: grid;
		gap: 1rem;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #a7c4ff;
	}

	h2 {
		margin: 0;
	}

	.output-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.output-chip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
	}

	.output-chip span {
		font-size: 0.82rem;
		color: rgba(242, 246, 251, 0.76);
	}

	.footer-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	code,
	pre {
		font-family: 'Cascadia Code', 'Consolas', monospace;
	}

	code {
		font-size: 0.95rem;
		color: #ffffff;
	}

	pre {
		margin: 0;
		padding: 1rem;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.06);
		overflow-x: auto;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #f2f6fb;
	}

	@media (max-width: 1100px) {
		.output-grid,
		.code-exports {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.output-grid,
		.code-exports {
			grid-template-columns: 1fr;
		}
	}
</style>
