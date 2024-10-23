<script lang="ts">
	import type { PageData } from "./$types";
	import { PUBLIC_FACILITY_NAME } from "$env/static/public";
	import Card from '$lib/ui/Card.svelte';
	import { version } from '$app/environment';
	import { HeartIcon } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData
	}
	let { data }: Props = $props();

	function logout() {
		document.cookie = "scheddy_token=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;"
		invalidateAll();
		goto("/");
	}
</script>

<div class="min-w-screen min-h-screen flex flex-col align-middle justify-center items-center">
	<p class="font-bold text-red-500">Internal Development Release - DO NOT SHARE</p>
	<Card class="pt-2">
		<div>
			<p class="text-sm text-right text-slate-500">Logged in as {data.user.firstName} {data.user.lastName} ({data.role}) - <button onclick={logout} class="hover:underline" href="/">Log out</button></p>

			<h1 class="mt-1 font-bold text-2xl text-center">Schedule appointment at {PUBLIC_FACILITY_NAME}</h1>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex flex-row gap-3 justify-center">
				{#if data.isTrainer}
					<a href="/my" class="block hover:underline text-sm text-blue-500 font-semibold">My Schedule</a>
				{/if}
				{#if data.isStaff}
					<a href="/dash" class="block hover:underline text-sm text-blue-500 font-semibold">Administration</a>
				{/if}
				{#if data.isDeveloper}
					<a href="/admin" class="block hover:underline text-sm text-blue-500 font-semibold">Site Management</a>
				{/if}
			</div>
			<a target="_blank" href="https://github.com/ZTL-ARTCC/scheddy" class="block hover:underline text-sm text-slate-500">scheddy v{version} - built with <HeartIcon class="inline w-5 h-5 align-top" /> by the ZTL ARTCC</a>
		</div>
	</Card>
</div>