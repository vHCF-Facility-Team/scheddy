<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { TrashIcon } from 'lucide-svelte';
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/form/Input.svelte';
	import Select from '$lib/ui/form/Select.svelte';
	import { goto } from '$app/navigation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { availSchema } from './availSchema';
	import { getTimeZones } from '@vvo/tzdb';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let addDateStr = $state('');

	const { form, errors, constraints, enhance } = superForm(data.form, {
		validators: zodClient(availSchema),
		dataType: 'json',
		async onUpdated({ form }) {
			if (form.valid) {
				await goto(`/dash/mentors/${data.mentor.id}`);
			}
		}
	});

	let timezones = $state(getTimeZones());
	timezones.sort((a, b) => {
		const nameA = a.name.toUpperCase(); // ignore upper and lowercase
		const nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}

		// names must be equal
		return 0;
	});
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-2xl font-semibold">
		Editing availability - {data.mentor.firstName}
		{data.mentor.lastName}
	</h1>

	<form method="POST" use:enhance>
		<div class="px-4 flex flex-col text-left gap-4">
			<Select
				name="timezone"
				bind:value={$form.timezone}
				{...$constraints.timezone}
				label="Timezone"
			>
				{#each timezones as tz}
					<option value={tz.name}>{tz.name} ({tz.alternativeName})</option>
				{/each}
			</Select>
			<span
				>Select the city closest to your location, to ensure that times are displayed correctly for
				you. Times below are entered <i>in this timezone.</i></span
			>
			<div class="flex flex-col md:flex-row gap-4">
				<div class="flex-1 flex flex-col gap-2">
					<h2 class="text-lg font-semibold">By weekday</h2>
					<div class="flex flex-col gap-3">
						{#each ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as day}
							{@const key = day.toLowerCase()}
							<div>
								<h3 class="text-lg font-semibold">{day}</h3>
								<div class="flex flex-row gap-2 align-baseline">
									<label for="av-s">Available?</label>
									<input
										class="w-6 h-6 border-blue-500 ring-blue-500 rounded bg-transparent"
										id="av-s"
										type="checkbox"
										bind:checked={$form[key].available}
									/>
								</div>
								{#if $form[key].available}
									<div class="flex flex-row gap-4">
										<Input
											label="Start Time Hour"
											bind:value={$form[key].start.hour}
											name="{key}.start.hour"
											error={$errors[key]?.start.hour}
										/>
										<Input
											label="Minute"
											bind:value={$form[key].start.minute}
											name="{key}.start.minute"
											error={$errors[key]?.start.minute}
										/>
									</div>
									<div class="flex flex-row gap-4">
										<Input
											label="End Time Hour"
											bind:value={$form[key].end.hour}
											name="{key}.end.hour"
											error={$errors[key]?.end.hour}
										/>
										<Input
											label="Minute"
											bind:value={$form[key].end.minute}
											name="{key}.end.minute"
											error={$errors[key]?.end.minute}
										/>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<div class="flex-1 flex flex-col gap-2">
					<h2 class="text-lg font-semibold">Date exceptions</h2>
					<i
						><b>First,</b> enter a date of interest, then press Add Exception. You can edit it afterwards.</i
					>

					<input
						class="bg-slate-950 border-blue-500 ring-blue-500 rounded"
						type="date"
						bind:value={addDateStr}
					/>
					<Button
						action="none"
						disabled={!addDateStr}
						onclick={(e) => {
							e.preventDefault();
							if (!$form.exceptions) {
								$form.exceptions = {};
							}
							if (!$errors.exceptions) {
								$errors.exceptions = {};
							}
							$form.exceptions[addDateStr] = {
								available: false,
								start: {
									hour: 0,
									minute: 0
								},
								end: {
									hour: 0,
									minute: 0
								}
							};
							$form = $form; // weird svelte bug
							addDateStr = '';
						}}>Add Exception</Button
					>

					{#each Object.keys($form.exceptions) as key}
						{#if $form.exceptions[key] === undefined}
							<p>Uh oh! Something has broken...</p>
							<p>
								Please click this button 5 times as quickly as you can, then ping Tyler in Discord:
							</p>
							<Button>Click me</Button>
							<p>Thanks.</p>
							<p>**DO NOT PRESS SET, YOUR AVAILABILITY WILL BREAK**</p>
						{:else}
							<h3 class="text-lg font-semibold">{key}</h3>
							<div class="flex flex-row gap-2 align-baseline">
								<label for="av-s">Available?</label>
								<input
									class="w-6 h-6 border-blue-500 ring-blue-500 rounded bg-transparent"
									id="av-s"
									type="checkbox"
									bind:checked={$form.exceptions[key].available}
								/>
								<Button
									action="none"
									onclick={(e) => {
										e.preventDefault();
										delete $form.exceptions[key];
										$form.exceptions = $form.exceptions;
									}}
									class="ml-4 w-6 h-6"
									size="icon"
									variant="danger"
								>
									<TrashIcon class="w-2 h-2" />
								</Button>
							</div>
							{#if $form.exceptions[key].available}
								<div class="flex flex-row gap-4">
									<Input
										label="Start Time Hour"
										bind:value={$form.exceptions[key].start.hour}
										name="exceptions.{key}.start.hour"
									/>
									<Input
										label="Minute"
										bind:value={$form.exceptions[key].start.minute}
										name="exceptions.{key}.start.minute"
									/>
								</div>
								<div class="flex flex-row gap-4">
									<Input
										label="End Time Hour"
										bind:value={$form.exceptions[key].end.hour}
										name="exceptions.{key}.end.hour"
									/>
									<Input
										label="Minute"
										bind:value={$form.exceptions[key].end.minute}
										name="exceptions.{key}.end.minute"
									/>
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			</div>

			<Button>Set</Button>
		</div>
	</form>
</div>
