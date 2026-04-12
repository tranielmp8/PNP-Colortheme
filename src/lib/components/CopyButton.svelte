<script lang="ts">
	let {
		label,
		copiedLabel,
		isCopied = false,
		oncopy
	}: {
		label: string;
		copiedLabel: string;
		isCopied?: boolean;
		oncopy: () => void;
	} = $props();
</script>

<button type="button" class="copy-button" onclick={oncopy}>
	{isCopied ? copiedLabel : label}
</button>

<style>
	.copy-button {
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 999px;
		padding: 0.45rem 0.8rem;
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.08);
		color: #f2f6fb;
	}
</style>
