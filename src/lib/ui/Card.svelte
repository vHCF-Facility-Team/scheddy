<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet,
		class: ClassValue | ClassValue[]
	}
	let { children, class: className = "", ...rest }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn("bg-slate-800 shadow-xl px-6 py-5 rounded space-y-4 text-center", className)} {...rest}>
	{@render children()}
</div>