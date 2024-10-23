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

<tr class={cn("odd:bg-slate-900 even:bg-slate-800 border-b border-slate-700", className)} {...rest}>
	{@render children()}
</tr>