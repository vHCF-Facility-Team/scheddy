<script lang="ts">
	import '../app.css';
	import type { PageData } from "./$types";

	let { children, data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="min-w-screen min-h-screen bg-slate-900 text-slate-100 flex align-middle justify-center items-center">
	{@render children()}
</div>