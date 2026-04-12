<script lang="ts">
	import CopyButton from '$lib/components/CopyButton.svelte';
	import type { PaletteColor } from '$lib/types/palette';

	let {
		palette,
		themeGradient,
		copiedKey,
		oncopy
	}: {
		palette: PaletteColor[];
		themeGradient: string;
		copiedKey: string | null;
		oncopy: (key: string, value: string) => void;
	} = $props();
</script>

<section class="theme-preview" aria-label="Palette preview">
	<!-- This component is read-only from a state perspective:
		it receives palette data and raises copy requests back to the parent. -->
	<div class="theme-preview__swatches" style={`--theme-gradient: linear-gradient(135deg, ${themeGradient});`}>
		{#each palette as color}
			<div class="theme-preview__swatch">
				<span>{color.name}</span>
				<div class="swatch-copy">
					<strong>{color.hex}</strong>
					<CopyButton
						label="Copy"
						copiedLabel="Copied"
						isCopied={copiedKey === `swatch-${color.id}`}
						oncopy={() => oncopy(`swatch-${color.id}`, color.hex)}
					/>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.theme-preview {
		padding: 1rem;
		background: rgba(7, 12, 20, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		backdrop-filter: blur(20px);
	}

	.theme-preview__swatches {
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

	.theme-preview__swatch span {
		font-size: 0.82rem;
		color: rgba(242, 246, 251, 0.76);
	}

	.swatch-copy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	@media (max-width: 1100px) {
		.theme-preview__swatches {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.theme-preview__swatches {
			grid-template-columns: 1fr;
		}
	}
</style>
