<script lang="ts">
	import type { PageData } from './$types';
	import { PUBLIC_FACILITY_NAME } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { version } from '$app/environment';
	import { HeartIcon, LoaderCircle } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { DateTime, Interval } from 'luxon';
	import { roleOf } from '$lib';
	import { ROLE_MENTOR, ROLE_STAFF } from '$lib/utils';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	function logout() {
		document.cookie = 'scheddy_token=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;';
		invalidateAll();
		goto('/');
	}

	let done = $state(false);

	const form = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				done = true;
			}
		}
	});
	const { form: formData, enhance, delayed, message } = form;

	$effect(() => {
		$formData.timezone = DateTime.local().zoneName;
	});
</script>

<div class="min-w-screen min-h-screen flex flex-col align-middle justify-center items-center">
	<Card.Root class="max-w-xl mx-4 text-center px-4 py-2">
		<Card.Header>
			<p class="text-sm text-right text-slate-500 mb-1">
				Logged in as {data.user.firstName}
				{data.user.lastName} ({data.role}) -
				<button onclick={logout} class="hover:underline">Log out</button>
			</p>
			<Card.Title>Schedule appointment at {PUBLIC_FACILITY_NAME}</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if done}
				<p>{$message}</p>
			{:else if !data.atMaxSessions}
				<form class="text-left flex flex-col gap-4" method="POST" use:enhance>
					<!-- Step 1: Always shown - session type -->
					<Form.Field {form} name="sessionType">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Session Type</Form.Label>
								<Select.Root type="single" bind:value={$formData.sessionType} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.sessionType
											? `${data.sessionMap[$formData.sessionType].name} (${data.sessionMap[$formData.sessionType].length} minutes)`
											: 'Select a session type'}
									</Select.Trigger>
									<Select.Content>
										{#each data.categories as category}
											<Select.Group>
												<Select.GroupHeading>{category.category}</Select.GroupHeading>
												{#each category.items as item}
													{@const label = `${item.name} (${item.length} minutes)`}
													<Select.Item value={item.id} {label}>{label}</Select.Item>
												{/each}
											</Select.Group>
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<!-- Step 2: Shown after specifying type - select slot -->
					{#if $formData.sessionType && $formData.sessionType !== ''}
						<Form.Field {form} name="timezone">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Timezone</Form.Label>
									<Select.Root type="single" bind:value={$formData.timezone} name={props.name}>
										<Select.Trigger {...props}>
											{$formData.timezone ? $formData.timezone : 'Select a timezone'}
										</Select.Trigger>
										<Select.Content>
											{#each data.timezones as timezone}
												{@const label = timezone.name}
												<Select.Item value={timezone.name} {label}>{label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						{@const slots = data.slotData[$formData.sessionType]}
						<Form.Field {form} name="slot">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Date & time</Form.Label>
									<Select.Root type="single" bind:value={$formData.slot} name={props.name}>
										<Select.Trigger {...props}>
											{#if $formData.slot}
												{#each slots as slot}
													{#if `${slot.slot}@${slot.mentor}` === $formData.slot}
														{@const interval = Interval.fromISO(slot.slot)}
														{#if interval.start}
															{interval.start
																.setZone($formData.timezone)
																.toLocaleString(DateTime.DATETIME_FULL)}
														{/if}
													{/if}
												{/each}
											{:else}
												Select a time and date
											{/if}
										</Select.Trigger>
										<Select.Content>
											{#each slots as slot}
												{@const interval = Interval.fromISO(slot.slot)}
												{#if interval.start}
													{@const label = interval.start
														.setZone($formData.timezone)
														.toLocaleString(DateTime.DATETIME_FULL)}
													<Select.Item value="{slot.slot}@{slot.mentor}" {label}
														>{label}</Select.Item
													>
												{/if}
											{:else}
												<Select.Item value="__invalid__" disabled label="No slots available :("
													>No slots available :(</Select.Item
												>
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					{/if}

					<!-- Step 3: Submit button -->
					{#if $formData.slot && $formData.slot !== ''}
						<Form.Button>
							{#if $delayed}
								<LoaderCircle class="w-4 h-4 animate-spin" />
							{:else}
								Schedule &rarr;
							{/if}
						</Form.Button>
					{/if}
				</form>
			{:else}
				<p>
					You have reached your facility's limit for maximum booked sessions. Contact your training
					staff if you believe this to be in error.
				</p>
			{/if}
		</Card.Content>
		<Card.Footer class="text-sm text-muted-foreground justify-center flex flex-col gap-2">
			<div class="flex flex-row gap-4 text-primary font-semibold">
				{#if roleOf(data.user) >= ROLE_MENTOR}
					<a class="hover:underline underline-offset-4" href="/dash/mentors/{data.user.id}"
						>My Schedule</a
					>
				{/if}
				{#if roleOf(data.user) >= ROLE_STAFF}
					<a class="hover:underline underline-offset-4" href="/dash">Administration</a>
				{/if}
			</div>
			<a
				target="_blank"
				href="https://github.com/ZTL-ARTCC/scheddy"
				class="hover:underline underline-offset-4"
				>scheddy v{version} - built with <HeartIcon class="inline w-5 h-5 align-top" /> by the ZTL ARTCC</a
			>
		</Card.Footer>
	</Card.Root>
</div>

<!--
<div class="min-w-screen min-h-screen flex flex-col align-middle justify-center items-center">
	<Card class="pt-2">
		<div>
			<p class="text-sm text-right text-slate-500">
				Logged in as {data.user.firstName}
				{data.user.lastName} ({data.role}) -
				<button onclick={logout} class="hover:underline" href="/">Log out</button>
			</p>

			<h1 class="mt-1 font-bold text-2xl text-center">
				{data.originalSessionType ? 'Reschedule' : 'Schedule'} appointment at {PUBLIC_FACILITY_NAME}
			</h1>

			<div class="text-left mt-3 mb-6 flex flex-col gap-4 justify-center">
				{#if !canCancelReschedule}
					<p>
						You cannot cancel or reschedule this session, as it is within 24 hours. Contact your
						mentor.
					</p>
				{:else if !isValidSession}
					<p>The provided Session ID is not valid. Have you cancelled this session?</p>
				{:else if step === 1}
					<Select bind:value={sessionType} label="Session Type">
						{#each categories.entries() as [k, v]}
							<optgroup label={k}>
								{#each v as typ}
									<option value={typ.id}>{typ.name} ({typ.length} minutes)</option>
								{/each}
							</optgroup>
						{/each}
					</Select>
					{#if sessionType !== null}
						<Button
							onclick={() => {
								step = 2;
							}}
						>
							Next
						</Button>
					{/if}
				{:else if step === 2}
					<Select name="timezone" bind:value={timezone} label="Timezone">
						{#each timezones as tz}
							<option value={tz.name}>{tz.name} ({tz.alternativeName})</option>
						{/each}
					</Select>
					{#if sessionType}
						<Select
							name="slot"
							bind:value={timeslot}
							label={data.originalSessionType ? 'New Session Date/Time' : 'Session Date/Time'}
						>
							{#each data.slotData[sessionType] as slot}
								<option value="{slot.slot}@{slot.mentor}"
									>{Interval.fromISO(slot.slot)
										.start.setZone(timezone)
										.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)} - {sTyps[sessionType]
										.length} minutes</option
								>
							{:else}
								{#if data.atMaxSessions}
									<option disabled>You already have the max number of sessions booked</option>
								{:else}
									<option disabled>No slots available :( Check back another time</option>
								{/if}
							{/each}
						</Select>
					{/if}
					<div class="flex flex-row justify-center gap-4 grow">
						{#if data.originalSessionType}
							<Button
								class="flex-1"
								variant="danger"
								onclick={() => {
									cancelOpen = true;
								}}>Cancel Appointment</Button
							>
						{:else}
							<Button
								class="flex-1"
								variant="ghost"
								onclick={() => {
									step = 1;
								}}
							>
								Back
							</Button>
						{/if}
						{#if timeslot !== null}
							<Button
								class="flex-1"
								onclick={() => {
									step = 3;
								}}
							>
								Next
							</Button>
						{/if}
					</div>
				{:else if step === 3}
					<p><b>Session type:</b> {sTyps[sessionType].name}</p>
					<p><b>Timezone:</b> {timezone}</p>
					<p>
						<b>Start time:</b>
						{start.setZone(timezone).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
					</p>
					<p><b>Duration:</b> {sTyps[sessionType].length} minutes</p>

					<div class="flex flex-row gap-2 align-baseline">
						<input
							class="w-6 h-6 border-blue-500 ring-blue-500 rounded bg-transparent"
							id="24h"
							type="checkbox"
							bind:checked={twentyFourHourPolicyUnderstood}
						/>
						<label for="24h"
							>I understand that I need to contact my mentor to make changes within 24 hours</label
						>
					</div>
					<div class="flex flex-row gap-2 align-baseline">
						<input
							class="w-6 h-6 border-blue-500 ring-blue-500 rounded bg-transparent"
							id="trainingOrder"
							type="checkbox"
							bind:checked={trainingOrderPolicyUnderstood}
						/>
						<label for="trainingOrder">I have read and understood the training order</label>
					</div>

					<div class="flex flex-row justify-center gap-4 grow">
						<Button
							class="flex-1"
							variant="ghost"
							onclick={() => {
								step = 2;
							}}
						>
							Back
						</Button>
						{#if twentyFourHourPolicyUnderstood && trainingOrderPolicyUnderstood}
							<Button onclick={book} class="flex-1">Schedule</Button>
						{/if}
					</div>
				{:else if step === 4}
					{#if bookingState === 'loading'}
						<p>Booking your session, please wait...</p>
					{:else if bookingState === 'success'}
						<p>
							Session booked 🥳 You'll receive a confirmation email shortly and you should see the
							session on your dashboard soon.
						</p>
					{:else}
						<p>
							Couldn't book the session :( There may have been a network error or someone else may
							have booked this slot.
						</p>
						<Button
							class="flex-1"
							variant="ghost"
							onclick={() => {
								step = 1;
								timeslot = null;
								trainingOrderPolicyUnderstood = false;
								twentyFourHourPolicyUnderstood = false;
							}}
						>
							Try again
						</Button>
					{/if}
				{/if}
			</div>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex flex-row gap-3 justify-center">
				<a
					href="/my_sessions"
					class="block hover:underline text-sm text-blue-500 font-semibold"
					title="Sessions you are the student in">Your Upcoming</a
				>
				{#if data.isTrainer}
					<a
						href="/dash/mentors/{data.user.id}"
						class="block hover:underline text-sm text-blue-500 font-semibold"
						title="Sessions you are the trainer for">My Schedule</a
					>
				{/if}
				{#if data.isStaff}
					<a href="/dash" class="block hover:underline text-sm text-blue-500 font-semibold"
						>Administration</a
					>
				{/if}
			</div>
			<a
				target="_blank"
				href="https://github.com/ZTL-ARTCC/scheddy"
				class="block hover:underline text-sm text-slate-500"
				>scheddy v{version} - built with <HeartIcon class="inline w-5 h-5 align-top" /> by the ZTL ARTCC</a
			>
		</div>
	</Card>
	{#if data.originalSessionType}
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
			<p class="mx-4">You'll need to re-book another session.</p>
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
	{/if}
</div>
-->
