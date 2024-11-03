<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const { form, constraints, enhance } = superForm(data.form, {
		dataType: 'json',
		async onUpdated({ form }) {
			if (form.valid) {
				await goto(`/dash/mentors/${data.mentor.id}`);
			}
		}
	});
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-2xl font-semibold">
		Editing allowed session types - {data.mentor.firstName}
		{data.mentor.lastName}
	</h1>

	<form method="POST" use:enhance>
		<div class="px-4 flex flex-col text-left gap-4">
			{#each Object.entries(data.typesMap) as [id, name]}
				<div class="flex flex-row gap-2 align-baseline">
					<label for={id}>{name}</label>
					<input
						class="w-6 h-6 border-blue-500 ring-blue-500 rounded bg-transparent"
						{id}
						type="checkbox"
						bind:checked={$form.allowed[id]}
						{...$constraints.cid}
					/>
				</div>
			{/each}
			<Button>Set</Button>
		</div>
	</form>
</div>
