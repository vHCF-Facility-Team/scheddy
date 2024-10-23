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
	import { EditIcon, PlusIcon, TrashIcon } from 'lucide-svelte';
	import Modal from '$lib/ui/Modal.svelte';
	interface Props {
		data: PageData
	}
	let { data }: Props = $props();

	let createOpen = $state(false);
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
						Add
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
						<Button size="icon">
							<EditIcon class="w-4 h-4" />
						</Button>
						<Button variant="danger" size="icon">
							<TrashIcon class="w-4 h-4" />
						</Button>
					</TableColumn>
				</TableRow>
			{/each}
		</TableBody>
	</TableRoot>
</div>

<Modal onclose={() => {createOpen = false;}} bind:open={createOpen}>
	<p>test</p>
</Modal>