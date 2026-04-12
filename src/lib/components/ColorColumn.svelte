<script lang="ts">
	import CopyButton from '$lib/components/CopyButton.svelte';
	import type { PaletteColor } from '$lib/types/palette';

	let {
		color,
		copiedKey,
		onhexchange,
		oncopy
	}: {
		color: PaletteColor;
		copiedKey: string | null;
		onhexchange: (id: number, value: string) => void;
		oncopy: (key: string, value: string) => void;
	} = $props();
</script>

<article class="color-column" style={`--column-color: ${color.hex};`}>
	<header>
		<p>{color.name}</p>
		<h2>{color.hex}</h2>
	</header>

	<div class="color-stage">
		<div class="color-stage__fill" aria-hidden="true"></div>
		<label class="picker-label">
			<span>Drag to adjust</span>
			<input
				type="color"
				value={color.hex}
				aria-label={`${color.name} picker`}
				/* The component does not mutate shared state directly.
				   It forwards the new value to the route through a callback. */
				oninput={(event) => onhexchange(color.id, (event.currentTarget as HTMLInputElement).value)}
			/>
		</label>
	</div>

	<label class="hex-field">
		<span>Hex code</span>
		<input
			type="text"
			inputmode="text"
			spellcheck="false"
			value={color.hex}
			aria-label={`${color.name} hex code`}
			onchange={(event) => onhexchange(color.id, (event.currentTarget as HTMLInputElement).value)}
			onblur={(event) => onhexchange(color.id, (event.currentTarget as HTMLInputElement).value)}
		/>
	</label>

	<div class="column-footer">
		<span>Live output</span>
		<div class="footer-copy">
			<code>{color.hex}</code>
			<CopyButton
				label="Copy"
				copiedLabel="Copied"
				isCopied={copiedKey === `column-${color.id}`}
				oncopy={() => oncopy(`column-${color.id}`, color.hex)}
			/>
		</div>
	</div>
</article>

<style>
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

	header {
		display: grid;
		gap: 0.35rem;
	}

	header p {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.75rem;
		color: rgba(242, 246, 251, 0.64);
	}

	h2 {
		margin: 0;
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

	.picker-label span,
	.hex-field span,
	.column-footer span {
		font-size: 0.82rem;
		color: rgba(242, 246, 251, 0.76);
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

	.column-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
	}

	.footer-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	code {
		font-family: 'Cascadia Code', 'Consolas', monospace;
		font-size: 0.95rem;
		color: #ffffff;
	}

	@media (max-width: 700px) {
		.color-column {
			min-height: auto;
		}
	}
</style>
