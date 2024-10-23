<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet,
		class: ClassValue | ClassValue[]
	}
	let { children, class: className = "", ...rest }: Props & HTMLThAttributes = $props();
</script>

<th scope="col" class={cn("px-6 py-3", className)} {...rest}>
	{@render children()}
</th>