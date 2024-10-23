<script lang="ts">
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { CreateSchema } from './createSchema';
	import { ROLE_STUDENT, ROLE_MENTOR, ROLE_STAFF, ROLE_DEVELOPER } from '$lib/utils';
	import Button from '$lib/ui/Button.svelte';
	import ModalFooter from '$lib/ui/modal/ModalFooter.svelte';
	import { CogIcon } from 'lucide-svelte';
	import Input from '$lib/ui/form/Input.svelte';
	import Select from '$lib/ui/form/Select.svelte';

	interface Props {
		data: SuperValidated<Infer<CreateSchema>>;
		oncancel: () => void;
		onsuccess: () => void;
	}
	let { data, oncancel, onsuccess }: Props = $props();

	const { form, delayed, errors, constraints, enhance } = superForm(data, {
		async onUpdated({ form }) {
			if (form.valid) {
				onsuccess();
			}
		}
	});
</script>

<form method="POST" action="?/create" use:enhance>
	<div class="px-4 flex flex-col text-left gap-4">
		<Input
			label="VATSIM CID"
			{...$constraints.cid}
			bind:value={$form.cid}
			name="cid"
			error={$errors.cid}
		/>

		<Select
			label="Role"
			{...$constraints.roleOverride}
			bind:value={$form.roleOverride}
			name="roleOverride"
			error={$errors.roleOverride}
		>
			<option value={ROLE_STUDENT}>Student</option>
			<option value={ROLE_MENTOR}>Mentor</option>
			<option value={ROLE_STAFF}>Staff</option>
			<option value={ROLE_DEVELOPER}>Developer</option>
		</Select>
	</div>

	<ModalFooter>
		<Button onclick={oncancel} variant="ghost" size="sm">Cancel</Button>
		<Button variant="formSubmit" size="sm">
			{#if $delayed}
				<CogIcon class="w-6 h-6 inline animate-spin" />
			{:else}
				Update
			{/if}
		</Button>
	</ModalFooter>
</form>
