<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_FACILITY_NAME } from '$env/static/public';
	import {
		CalendarClockIcon,
		CalendarIcon,
		CalendarPlusIcon,
		LibraryIcon,
		LogOutIcon,
		UsersIcon
	} from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
		children: Snippet;
	}
	let { data, children }: Props = $props();

	let pages = [
		{ path: '/dash', name: 'Facility Calendar', icon: CalendarIcon },
		{ path: '/my', name: 'My Schedule', icon: CalendarClockIcon },
		{ path: '/dash/types', name: 'Session Management', icon: LibraryIcon },
		{ path: '/dash/users', name: 'User Management', icon: UsersIcon },
		{ path: '/schedule', name: 'Book Session', icon: CalendarPlusIcon }
	];

	function logout() {
		document.cookie = 'scheddy_token=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;';
		invalidateAll();
		goto('/');
	}
</script>

<div class="flex flex-col">
	<!-- header -->
	<div
		class="bg-slate-800 min-h-14 h-14 min-w-screen flex flex-row items-center px-6 pt-3 pb-4 justify-between border-b border-slate-900"
	>
		<h2 class="font-bold">{PUBLIC_FACILITY_NAME}</h2>
		<p class="font-bold text-red-500">INTERNAL DEVELOPMENT RELEASE</p>
		<p class="font-bold text-red-500">DO NOT DISTRIBUTE</p>
		<p class="font-semibold">Hello, {data.user.firstName} {data.user.lastName} ({data.role})</p>
	</div>

	<!-- sidebar & main layout -->
	<div class="flex min-h-[calc(100vh-3.5rem)] h-[calc(100vh-3.5rem)] flex-row flex-1">
		<div class="flex flex-col bg-slate-700 px-3 py-4 text-md">
			{#each pages as p}
				<a
					href={p.path}
					class:bg-slate-600={$page.url.pathname === p.path}
					class="flex flex-row min-w-64 px-4 py-3 rounded hover:text-slate-300 transition justify-start items-start text-left hover:cursor-pointer"
				>
					<p.icon class="w-5 mr-2 font-medium" />
					<span>{p.name}</span>
				</a>
			{/each}
			<button
				onclick={logout}
				class="flex flex-row min-w-64 px-4 py-3 rounded hover:text-slate-300 transition justify-start items-start text-left hover:cursor-pointer"
			>
				<LogOutIcon class="w-5 mr-2 font-medium" />
				<span>Log out</span>
			</button>
		</div>
		<div class="flex-1 px-8 py-4">
			{@render children()}
		</div>
	</div>
</div>
