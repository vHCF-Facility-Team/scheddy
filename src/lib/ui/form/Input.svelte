<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		error: string[] | undefined;
		name: string;
		label: string;
		value: string | number | null;
	}
	let {
		error,
		name,
		label,
		value = $bindable(null),
		...rest
	}: Props & HTMLAttributes<HTMLInputElement> = $props();
	let invalid = $derived(error !== undefined);
</script>

<div class="flex flex-col">
	<label
		class="uppercase text-sm font-semibold {invalid ? 'text-red-500' : 'text-slate-400'}"
		for={name}>{label}</label
	>
	<input
		class="bg-slate-700 border-2 {invalid ? 'border-red-500' : 'border-slate-600'} rounded mt-2"
		aria-invalid={invalid}
		bind:value
		{...rest}
		{name}
		id={name}
	/>
	{#if invalid}
		<span class="text-red-500 font-semibold">{error}</span>
	{/if}
</div>
