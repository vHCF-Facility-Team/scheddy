<script lang="ts">
	import { XIcon } from 'lucide-svelte';

	interface Props {
		title: string,
		onclose: () => void,
	}
	let { title, onclose }: Props = $props();
</script>

<div class="w-full border-b border-slate-900/60 flex flex-row gap-8 p-4 justify-between">
	<h2 class="text-xl font-bold">{title}</h2>
	<button class="text-slate-400 hover:text-slate-500 transition" onclick={onclose}>
		<XIcon />
	</button>
</div>