<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet;
		class: ClassValue | ClassValue[];
	}
	let {
		children,
		class: className = '',
		...rest
	}: Props & HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<thead class={cn(className)} {...rest}>
	{@render children()}
</thead>
