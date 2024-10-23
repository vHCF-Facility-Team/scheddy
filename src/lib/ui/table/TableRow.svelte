<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet,
		class: ClassValue | ClassValue[]
	}
	let { children, class: className = "", ...rest }: Props & HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class={cn("odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700", className)} {...rest}>
	{@render children()}
</tr>