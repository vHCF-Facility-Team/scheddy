<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet,
		href: string | undefined,
		variant: "normal" | "danger" | "tableCreateAction",
		size: "icon" | "md",
		class: ClassValue | ClassValue[]
	}
	let { children, href = undefined, variant = "normal", size = "md", class: className = "", ...rest }: Props & HTMLAttributes<HTMLButtonElement> = $props();

	const base = "inline-block text-center rounded font-bold transition shadow";
	const variants = {
		normal: "bg-blue-500 text-blue-950 hover:bg-blue-600",
		danger: "bg-red-500 text-red-950 hover:bg-red-600",
		tableCreateAction: "bg-blue-500 text-blue-950 hover:bg-blue-600 flex flex-row p-2 float-right align-top",
	};
	const sizes = {
		icon: "p-2",
		md: "p-4",
	}

	let mergedClassName = cn(base, sizes[size], variants[variant], className);
</script>

{#if href}
	<a class={mergedClassName} {href}>
		{@render children()}
	</a>
{:else}
	<button {...rest} class={mergedClassName}>
		{@render children()}
	</button>
{/if}