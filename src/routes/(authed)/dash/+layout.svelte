<script lang="ts">
	import type { PageData } from "./$types";
	import { PUBLIC_FACILITY_NAME } from "$env/static/public";
	import { CalendarIcon, LibraryIcon, UsersIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	interface Props {
		data: PageData,
		children: Snippet
	}
	let { data, children }: Props = $props();

	let pages = [
		{ path: "/dash", name: "Calendar", icon: CalendarIcon },
		{ path: "/dash/users", name: "Users", icon: UsersIcon },
		{ path: "/dash/types", name: "Session Types", icon: LibraryIcon }
	]
</script>

<div class="flex flex-col">
	<!-- header -->
	<div class="bg-slate-800 min-h-14 h-14 min-w-screen flex flex-row items-center px-6 pt-3 pb-4 justify-between border-b border-slate-900">
		<h2 class="font-bold">{PUBLIC_FACILITY_NAME}</h2>
		<p class="font-semibold">Hello, {data.user.firstName} {data.user.lastName} ({data.role})</p>
	</div>

	<!-- sidebar & main layout -->
	<div class="flex min-h-[calc(100vh-3.5rem)] h-[calc(100vh-3.5rem)] flex-row flex-1">
		<div class="flex flex-col bg-slate-700 px-3 py-4 text-md">
			{#each pages as p}
				<a href={p.path} class:bg-slate-600={$page.url.pathname === p.path} class="flex flex-row min-w-64 px-4 py-3 rounded hover:text-slate-300 transition justify-start items-start text-left hover:cursor-pointer">
					<p.icon class="w-5 mr-2 font-medium" />
					<span>{p.name}</span>
				</a>
			{/each}
		</div>
		<div class="flex-1 px-8 py-4">
			{@render children()}
		</div>
	</div>
</div>

