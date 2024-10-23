<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props {
		error: string[] | undefined;
		name: string;
		label: string;
		value: string | null;
		children: Snippet;
	}
	let {
		children,
		error,
		name,
		label,
		value = $bindable(null),
		...rest
	}: Props & HTMLAttributes<HTMLSelectElement> = $props();
	let invalid = $derived(error !== undefined);
</script>

<div class="flex flex-col">
	<label
		class="uppercase text-sm font-semibold {invalid ? 'text-red-500' : 'text-slate-400'}"
		for={name}>{label}</label
	>
	<select
		class="bg-slate-700 border-2 {invalid ? 'border-red-500' : 'border-slate-600'} rounded mt-2"
		aria-invalid={invalid}
		bind:value
		{...rest}
		{name}
		id={name}
	>
		{@render children()}
	</select>
	{#if invalid}
		<span class="text-red-500 font-semibold">{error}</span>
	{/if}
</div>
