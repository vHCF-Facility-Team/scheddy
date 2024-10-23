<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet,
		class: ClassValue | ClassValue[]
	}
	let { children, class: className = "", ...rest }: Props & HTMLAttributes<HTMLTableElement> = $props();
</script>


	<table class={cn("w-full txt-sm text-left rtl:text-right text-gray-400", className)} {...rest}>
		{@render children()}
	</table>
