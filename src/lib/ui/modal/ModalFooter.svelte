<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<div class="w-full mt-4 border-t border-slate-900/60 flex flex-row gap-4 p-4 justify-end">
	{@render children()}
</div>
