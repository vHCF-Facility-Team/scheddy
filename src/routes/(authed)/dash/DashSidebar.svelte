<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		CalendarClockIcon,
		CalendarIcon,
		CalendarPlusIcon,
		GraduationCapIcon,
		LayoutGridIcon,
		LibraryIcon,
		TowerControl,
		UsersIcon
	} from 'lucide-svelte';
	import { ROLE_MENTOR, ROLE_STAFF, ROLE_STUDENT, roleString } from '$lib/utils';
	import { PUBLIC_FACILITY_NAME } from '$env/static/public';
	import { version } from '$app/environment';
	import SbFacility from './SbFacility.svelte';
	import MainNav from './MainNav.svelte';
	import NavUser from './NavUser.svelte';

	interface Props {
		role: number;
		userId: number;
		name: string;
	}
	let { role, userId, name }: Props = $props();
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<SbFacility />
	</Sidebar.Header>

	<Sidebar.Content>
		<MainNav {role} {userId} />
	</Sidebar.Content>

	<Sidebar.Footer>
		<NavUser {name} role={roleString(role)} />
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
