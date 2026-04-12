export async function copyTextToClipboard(value: string): Promise<boolean> {
	// Wrapping browser APIs in a utility gives the route a small, readable
	// interface and makes future fallback handling easier to add in one place.
	if (typeof navigator === 'undefined' || !navigator.clipboard) {
		return false;
	}

	await navigator.clipboard.writeText(value);
	return true;
}
