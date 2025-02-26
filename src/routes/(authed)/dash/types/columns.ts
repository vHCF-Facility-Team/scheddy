import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableAddButton from './DataTableAddButton.svelte';
import DataTableActions from './DataTableActions.svelte';

export type TSType = {
	id: string,
	category: string,
	name: string,
	order: number,
	length: number
}

export const stColumns: ColumnDef<TSType>[] = [
	{
		accessorKey: 'category',
		header: 'Category'
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'length',
		header: 'Duration (minutes)'
	},
	{
		accessorKey: 'order',
		header: 'Ordering',
	},
	{
		id: 'actions',
		header: () => {
			return renderComponent(DataTableAddButton, {});
		},
		cell: ({row}) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];