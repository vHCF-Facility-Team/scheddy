<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar";
	import {
		CalendarClockIcon,
		CalendarIcon, CalendarPlusIcon,
		GraduationCapIcon, HistoryIcon,
		LayoutGridIcon,
		LibraryIcon,
		UsersIcon
	} from 'lucide-svelte';
	import { ROLE_MENTOR, ROLE_STAFF, ROLE_STUDENT } from '$lib/utils';
	import type { NestedMenuItem } from './nav';
	import NavSection from './NavSection.svelte';

	interface Props {
		role: number,
		userId: number
	}
	let { role, userId }: Props = $props();

	let commonPages: NestedMenuItem[] = [
		{
			url: '/dash',
			title: 'Dashboard',
			icon: LayoutGridIcon,
			visible: role >= ROLE_MENTOR
		},
		{
			url: '/schedule',
			title: 'Book Session',
			icon: CalendarPlusIcon,
			visible: role >= ROLE_STUDENT
		}
	];

	let schedulingPages: NestedMenuItem[] = [
		{
			url: '/dash/cal',
			title: 'Facility Calendar',
			icon: CalendarIcon,
			visible: role >= ROLE_MENTOR,
			children: [
				{
					url: '/dash/cal/old',
					title: 'Past Sessions',
					icon: HistoryIcon,
					visible: role >= ROLE_MENTOR
				}
			]
		},
		{
			url: `/dash/mentors/${userId}`,
			title: 'My Schedule',
			icon: CalendarClockIcon,
			visible: role >= ROLE_MENTOR
		},
	];
	let facilityAdministrationPages: NestedMenuItem[] = [
		{
			url: '/dash/types',
			title: 'Session Types',
			icon: LibraryIcon,
			visible: role >= ROLE_STAFF
		},
		{
			url: '/dash/mentors',
			title: 'Mentors',
			icon: GraduationCapIcon,
			visible: role >= ROLE_STAFF
		},
	];
	let siteAdministrationPages: NestedMenuItem[] = [
		{
			url: '/dash/users',
			title: 'User Management',
			icon: UsersIcon,
			visible: role >= ROLE_STAFF
		},
	];

	let sections: { data: NestedMenuItem[], title?: string }[] = [
		{ data: commonPages },
		{ title: 'Scheduling', data: schedulingPages },
		{ title: 'Facility Administration', data: facilityAdministrationPages },
		{ title: 'Site Administration', data: siteAdministrationPages }
	];
</script>

{#each sections as section}
	<NavSection data={section.data} title={section.title} />
{/each}