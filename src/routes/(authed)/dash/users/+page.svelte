<script lang="ts">
	import type { PageData } from "./$types";
	import { roleString } from '$lib/utils';
	interface Props {
		data: PageData
	}
	let { data }: Props = $props();
</script>


<i>ATMs, DATMs, WMs, and TAs will not appear on this list, as their access is granted automatically by their VATUSA role.</i>

<table>
	<thead>
	<tr>
		<th>CID</th>
		<th>User</th>
		<th>Role</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#each data.users as user}
		<tr>
			<td>{user.id}</td>
			<td>{user.firstName} {user.lastName}</td>
			{#if user.roleOverride}
				<td>{roleString(user.roleOverride)}</td>
			{:else}
				<td><i>Unknown</i></td>
			{/if}
			<td>
				<button>Remove</button>
			</td>
		</tr>
	{/each}
	</tbody>
</table>