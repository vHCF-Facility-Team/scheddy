<script lang="ts">
	import type { PageData } from "./$types";
	import { roleString } from '$lib/utils';
	import TableRoot from '$lib/ui/table/TableRoot.svelte';
	import TableHead from '$lib/ui/table/TableHead.svelte';
	import TableHeadColumn from '$lib/ui/table/TableHeadColumn.svelte';
	import TableBody from '$lib/ui/table/TableBody.svelte';
	import TableRow from '$lib/ui/table/TableRow.svelte';
	import TableColumn from '$lib/ui/table/TableColumn.svelte';
	interface Props {
		data: PageData
	}
	let { data }: Props = $props();
</script>

	<i class="ml-1">ATMs, DATMs, WMs, and TAs will not appear on this list, as their access is granted automatically by their VATUSA role.</i>

	<div class="relative overflow-x-auto shadow-md rounded mt-2">
	<TableRoot>
		<TableHead>
			<TableHeadColumn>User</TableHeadColumn>
			<TableHeadColumn>Role Override</TableHeadColumn>
			<TableHeadColumn>VATUSA Role</TableHeadColumn>
			<TableHeadColumn>Actions</TableHeadColumn>
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
						Remove
					</TableColumn>
				</TableRow>
			{/each}
		</TableBody>
	</TableRoot>
	</div>