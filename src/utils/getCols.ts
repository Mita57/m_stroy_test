import type { ColDef } from 'ag-grid-community';
import CategoryCell from '@/components/CategoryCell.vue';

export interface IRow {
  id: string | number;
  label: boolean;
}

export default (isEdit: boolean): ColDef<IRow>[] => (
  [
    {
      field: 'id',
      headerName: 'id',
      cellDataType: 'text',
      width: 100,
    },
    {
      colId: 'actions',
      headerName: 'Категория',
      cellRenderer: CategoryCell,
    },
    { field: 'label', headerName: 'Название', editable: isEdit },
  ]
);
