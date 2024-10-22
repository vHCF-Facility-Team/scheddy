<script lang="ts">
	import type { PageData } from "./$types";
	import { PUBLIC_FACILITY_NAME } from "$env/static/public";
	import Card from '$lib/ui/Card.svelte';
	import { version } from '$app/environment';
	import { HeartIcon } from 'lucide-svelte';

	interface Props {
		data: PageData
	}
	let { data }: Props = $props();
</script>

<Card>
	<p class="font-bold text-red-500">Internal Development Release - DO NOT SHARE</p>
	<div>
		<h1 class="font-bold text-2xl text-center">Schedule appointment at {PUBLIC_FACILITY_NAME}</h1>
		<p class="text-sm text-slate-500">Logged in as {data.user.firstName} {data.user.lastName}</p>
	</div>

	<a target="_blank" href="https://github.com/ZTL-ARTCC/scheddy" class="block hover:underline text-sm text-slate-500">scheddy v{version} - built with <HeartIcon class="inline w-5 h-5 align-top" /> by the ZTL ARTCC</a>
</Card>