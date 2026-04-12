<script lang="ts">
	let {
		// `$bindable()` allows the parent route to bind directly to `themeName`
		// while this component stays focused on rendering the form UI.
		themeName = $bindable(),
		themeSlug
	}: {
		themeName: string;
		themeSlug: string;
	} = $props();
</script>

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

<style>
	.theme-meta {
		padding: 1.25rem;
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 1rem;
		align-items: end;
		background: rgba(7, 12, 20, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		backdrop-filter: blur(20px);
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

	code {
		font-family: 'Cascadia Code', 'Consolas', monospace;
		font-size: 0.95rem;
		color: #ffffff;
	}

	@media (max-width: 1100px) {
		.theme-meta {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.theme-meta,
		.theme-meta__details {
			grid-template-columns: 1fr;
		}
	}
</style>
