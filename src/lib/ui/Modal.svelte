<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet,
		open: boolean,
		onclose: () => void,
	}
	let { children, open = $bindable(), onclose }: Props = $props();
</script>
