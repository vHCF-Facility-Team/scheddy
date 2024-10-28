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
	}: Props & HTMLAttributes<HTMLTableCellElement> = $props();
</script>

<td class={cn('px-6 py-4', className)} {...rest}>
	{@render children?.()}
</td>
