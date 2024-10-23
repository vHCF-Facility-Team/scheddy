<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet,
		class: ClassValue | ClassValue[]
	}
	let { children, class: className = "", ...rest }: Props = $props();
</script>

<thead class={cn("text-xs uppercase bg-gray-700 text-gray-400", className)} {...rest}>
<tr>
	{@render children()}
</tr>
</thead>