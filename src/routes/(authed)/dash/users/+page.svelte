<script lang="ts">
	import type { PageData } from "./$types";
	import { roleString } from '$lib/utils';
	import TableRoot from '$lib/ui/table/TableRoot.svelte';
	import TableHead from '$lib/ui/table/TableHead.svelte';
	import TableHeadColumn from '$lib/ui/table/TableHeadColumn.svelte';
	import TableBody from '$lib/ui/table/TableBody.svelte';
	import TableRow from '$lib/ui/table/TableRow.svelte';
	import TableColumn from '$lib/ui/table/TableColumn.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { CogIcon, EditIcon, PlusIcon, TrashIcon } from 'lucide-svelte';
	import Modal from '$lib/ui/modal/Modal.svelte';
	import ModalHeader from '$lib/ui/modal/ModalHeader.svelte';
	import ModalBody from '$lib/ui/modal/ModalBody.svelte';
	import ModalFooter from '$lib/ui/modal/ModalFooter.svelte';
	import CreateForm from './CreateForm.svelte';
	import { invalidateAll } from '$app/navigation';
	interface Props {
		data: PageData
	}
	let { data }: Props = $props();

	let createOpen = $state(false);
	let deleteOpen = $state(false);
	let deleteUser: string | null = $state(null);
	async function del() {
		if (!deleteUser) return;
		let params = new URLSearchParams();
		params.set("id", deleteUser);
		await fetch("?/remove", {
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: params.toString()
		});
		await invalidateAll();
		deleteOpen = false;
		deleteUser = null;
	}
</script>

<i class="ml-1">ATMs, DATMs, WMs, and TAs will not appear on this list, as their access is granted automatically by their VATUSA role.</i>

<div class="relative overflow-x-auto shadow-md rounded mt-2">
	<TableRoot>
		<TableHead>
			<TableHeadColumn>User</TableHeadColumn>
			<TableHeadColumn>Role Override</TableHeadColumn>
			<TableHeadColumn>VATUSA Role</TableHeadColumn>
			<TableHeadColumn>
				<div class="flex flex-row align-middle justify-between items-center">
					<span>Actions</span>
					<Button onclick={() => {createOpen = true;}} variant="tableCreateAction">
						<PlusIcon class="w-4 h-4 mr-2" />
						Add/Update
					</Button>
				</div>
			</TableHeadColumn>
		</TableHead>
		<TableBody>
			{#each data.users as user}
				<TableRow>
					<TableColumn scope="row" class="font-medium whitespace-nowrap text-white">
						<span>{user.firstName} {user.lastName}</span>
						{#if user.isVisitor}
							<span class="bg-yellow-500 text-yellow-950 rounded-full py-1 px-3">Visitor</span>
						{/if}
					</TableColumn>
					{#if user.roleOverride}
						<TableColumn>{roleString(user.roleOverride)}</TableColumn>
					{:else}
						<TableColumn>Unknown?</TableColumn>
					{/if}
					{#if user.role}
						<TableColumn>{roleString(user.role)}</TableColumn>
					{:else}
						<TableColumn>Unknown?</TableColumn>
					{/if}
					<TableColumn>
						<Button onclick={() => {
							deleteUser = user.id;
							deleteOpen = true;
						}} variant="danger" size="icon">
							<TrashIcon class="w-4 h-4" />
						</Button>
					</TableColumn>
				</TableRow>
			{/each}
		</TableBody>
	</TableRoot>
</div>

<Modal onclose={() => {createOpen = false;}} bind:open={createOpen}>
	<ModalHeader onclose={() => {createOpen = false;}} title="Set role override" />
	<ModalBody>
		<CreateForm onsuccess={() => {createOpen = false;}} oncancel={() => {createOpen = false;}} data={data.createForm} />
	</ModalBody>
</Modal>

<Modal onclose={() => {deleteOpen = false;}} bind:open={deleteOpen}>
	<ModalHeader onclose={() => {deleteOpen = false;}} title="Confirm override removal" />
	<ModalBody>
		<div class="px-4">
			<p>The user's permissions will be reset to their VATUSA role.</p>
		</div>
	</ModalBody>
	<ModalFooter>
		<Button onclick={() => {deleteOpen = false;}} variant="ghost" size="sm">Cancel</Button>
		<Button onclick={del} variant="danger" size="sm">
			Remove
		</Button>
	</ModalFooter>
</Modal>