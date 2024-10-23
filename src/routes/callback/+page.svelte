<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<p class="font-bold text-red-500">INTERNAL DEVELOPMENT RELEASE - DO NOT DISTRIBUTE</p>
<Card>
	{#if data.success}
		<p>Logged in successfully. You'll be redirected in a moment!</p>
	{:else}
		<h1 class="font-bold text-2xl text-center">Something went wrong :(</h1>
		<p class="text-center">{data.error_message} (error code: {data.error_code})</p>
		<Button href="/">Try again</Button>
	{/if}
</Card>
<p class="font-bold text-red-500">INTERNAL DEVELOPMENT RELEASE - DO NOT DISTRIBUTE</p>
