<script lang="ts">
	import type { PageData } from "./$types";
	import { DateTime } from "luxon";
	import Button from '$lib/ui/Button.svelte';
	import ModalHeader from '$lib/ui/modal/ModalHeader.svelte';
	import Modal from '$lib/ui/modal/Modal.svelte';
	import ModalBody from '$lib/ui/modal/ModalBody.svelte';
	import ModalFooter from '$lib/ui/modal/ModalFooter.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData
	}
	let { data }: Props = $props();

	let cancelOpen = $state(false);
	let rescheduleOpen = $state(false);

	async function cancel() {
		await fetch("?/cancel", {
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		await goto("/dash");
		await invalidateAll();
	}
	async function reschedule() {

	}
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-semibold">Session - {data.sessionInfo.sessionType.name} at {DateTime.fromISO(data.sessionInfo.session.start).toLocaleString(DateTime.DATETIME_HUGE)} for {data.sessionInfo.student.firstName} {data.sessionInfo.student.lastName}</h1>
	<p><b>Student:</b> {data.sessionInfo.student.firstName} {data.sessionInfo.student.lastName} ({data.sessionInfo.student.id})</p>
	<p><b>Mentor:</b> {data.sessionInfo.mentor.firstName} {data.sessionInfo.mentor.lastName} ({data.sessionInfo.mentor.id})</p>
	<p><b>Date:</b> {DateTime.fromISO(data.sessionInfo.session.start).toLocaleString(DateTime.DATETIME_HUGE)}</p>
	<p><b>Session Type:</b> {data.sessionInfo.sessionType.category} - {data.sessionInfo.sessionType.name}</p>
	<p><b>Duration:</b> {data.sessionInfo.sessionType.length} minutes</p>
	{#if data.isMentor}
		<h2 class="font-bold text-lg">Mentor/Staff Actions</h2>
		<div>
			<Button onclick={() => {cancelOpen = true;}} variant="danger">
				Cancel
			</Button>
			<Button onclick={() => {rescheduleOpen = true;}} variant="danger">
				Reschedule
			</Button>
		</div>
	{/if}
</div>

{#if data.isMentor}
	<Modal
		onclose={() => {
		cancelOpen = false;
	}}
		bind:open={cancelOpen}
	>
		<ModalHeader
			onclose={() => {
			cancelOpen = false;
		}}
			title="Confirm cancellation"
		/>
		<ModalBody>
			<div class="px-4">
				<p class="text-red-500">
					It is your responsibility to inform the student of the cancellation.
				</p>
			</div>
		</ModalBody>
		<ModalFooter>
			<Button
				onclick={() => {
				cancelOpen = false;
			}}
				variant="ghost"
				size="sm">Nevermind</Button
			>
			<Button onclick={cancel} variant="danger" size="sm">Yes, cancel</Button>
		</ModalFooter>
	</Modal>
	<Modal
		onclose={() => {
		rescheduleOpen = false;
	}}
		bind:open={rescheduleOpen}
	>
		<ModalHeader
			rescheduleOpen={() => {
			cancelOpen = false;
		}}
			title="Reschedule"
		/>
		<ModalBody>
			<div class="px-4">
				<p class="text-red-500">
					It is your responsibility to inform the student of the rescheduling.
				</p>
			</div>
		</ModalBody>
		<ModalFooter>
			<Button
				onclick={() => {
				rescheduleOpen = false;
			}}
				variant="ghost"
				size="sm">Nevermind</Button
			>
			<Button onclick={reschedule} variant="danger" size="sm">Reschedule</Button>
		</ModalFooter>
	</Modal>
{/if}