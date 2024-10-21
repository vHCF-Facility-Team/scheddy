<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet,
		href: string | undefined,
		class: ClassValue | ClassValue[]
	}
	let { children, href = undefined, class: className = "" }: Props & HTMLAttributes<HTMLButtonElement> = $props();

	let mergedClassName = cn("inline-block text-center bg-blue-500 rounded p-4 font-bold text-blue-950 hover:bg-blue-600 transition shadow", className);
</script>

{#if href}
	<a class={mergedClassName} {href}>
		{@render children()}
	</a>
{:else}
	<button class={mergedClassName}>
		{@render children()}
	</button>
{/if}