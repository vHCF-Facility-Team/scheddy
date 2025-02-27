<script lang="ts">
	import type { PageData } from './$types';
	import { DateTime } from 'luxon';
	import ModalHeader from '$lib/ui/modal/ModalHeader.svelte';
	import Modal from '$lib/ui/modal/Modal.svelte';
	import ModalBody from '$lib/ui/modal/ModalBody.svelte';
	import ModalFooter from '$lib/ui/modal/ModalFooter.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import Input from '$lib/ui/form/Input.svelte';
	import { CalendarDaysIcon, ClockIcon, GraduationCapIcon, IdCardIcon, ScrollTextIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import DataDisplay from './DataDisplay.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let cancelOpen = $state(false);
	let rescheduleOpen = $state(false);

	let date: string = $state('');
	let hour: number = $state(0);
	let minute: number = $state(0);

	async function cancel() {
		await fetch('?/cancel', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		await goto('/dash');
		await invalidateAll();
	}
	async function reschedule() {
		let udata = new URLSearchParams();

		let [ys, ms, ds] = date.split('-');
		let y = Number.parseInt(ys);
		let m = Number.parseInt(ms);
		let d = Number.parseInt(ds);

		let datetime = DateTime.now().setZone(data.sessionInfo.mentor.timezone).set({
			year: y,
			month: m,
			day: d,
			hour: hour,
			minute: minute,
			second: 0,
			millisecond: 0
		});

		udata.set('date', datetime.toISO()!);
		await fetch('?/reschedule', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: udata.toString()
		});

		await invalidateAll();
		rescheduleOpen = false;
	}
</script>

<h2 class="text-xl font-semibold">
	Session Information
</h2>

<table class="max-w-2xl">
	<tbody>

	<DataDisplay icon={GraduationCapIcon} label="Student">
		{data.sessionInfo.student.firstName} {data.sessionInfo.student.lastName}
	</DataDisplay>
	<DataDisplay icon={IdCardIcon} label="Mentor">
		{data.sessionInfo.mentor.firstName} {data.sessionInfo.mentor.lastName}
	</DataDisplay>
	<DataDisplay icon={CalendarDaysIcon} label="Date">
		{DateTime.fromISO(data.sessionInfo.session.start).toLocaleString(DateTime.DATETIME_HUGE)}
	</DataDisplay>
	<DataDisplay icon={ClockIcon} label="Duration">
		{data.sessionInfo.sessionType.length} minutes
	</DataDisplay>
	</tbody>
</table>

<div class="flex flex-row flex-wrap gap-2">
	<Button href="/dash/sessions/{data.sessionInfo.session.id}/edit">Edit</Button>
	<Button href="/dash/sessions/{data.sessionInfo.session.id}/cancel" variant="destructive">Cancel</Button>
</div>