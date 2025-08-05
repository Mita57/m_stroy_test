<template>
  <div id='table'>
    <ag-grid-vue
      style='width: 100%; height: 650px'
      :columnDefs='colDefs'
      :rowData='rowData'
      @cell-clicked="onCellClicked"
      @grid-ready="onGridReady"
      @cell-editing-stopped="onEditStopped"
      :defaultColDef='defaultColDef'
    >
    </ag-grid-vue>
  </div>
</template>

<script lang='ts' setup>
import {
  defineExpose, onMounted, ref, shallowRef,
} from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type {
  CellClickedEvent, CellEditingStoppedEvent, ColDef, GridApi, GridReadyEvent,
} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ItemWithChildren, useDataTableStore } from '@/stores/dataTableStore';
import getCols, { IRow } from '@/utils/getCols';
import CategoryCell from '@/components/CategoryCell.vue';
import { ItemMember } from '@/utils/TreeStore';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridApi = shallowRef<GridApi<IRow> | null>(null);
const dataTableStore = useDataTableStore();
const isEditMode = ref<boolean>(false);
const rowData = ref<ItemWithChildren[]>([]);

const onDeleteClick = (id: number | string) => {
  dataTableStore.removeItem(id);
  rowData.value = dataTableStore.getItemsToRender;
};

const onAddClick = (id: string | number) => {
  dataTableStore.addItem(id);
  console.log(dataTableStore.getItemsToRender);
  rowData.value = dataTableStore.getItemsToRender;
};

const onEditStopped = (event: CellEditingStoppedEvent) => {
  const oldItem: ItemWithChildren = event.data;
  const newItem: ItemMember = {
    ...oldItem,
    label: event.value,
  };
  dataTableStore.updateItem(newItem);
  rowData.value = dataTableStore.getItemsToRender;
};

const colDefs = ref<ColDef<IRow>[]>(getCols(
  false,
  onDeleteClick,
  onAddClick,
));

onMounted(() => {
  rowData.value = dataTableStore.getItemsToRender;
  isEditMode.value = dataTableStore.isEditMode;
  dataTableStore.$subscribe((mutation) => {
    if (mutation.events?.key === 'isEditMode') {
      gridApi.value!.setGridOption('columnDefs', getCols(
        mutation.events.newValue,
        onDeleteClick,
        onAddClick,
      ));
    }
  });
});
defineExpose({ CategoryCell });

const onCellClicked = (event: CellClickedEvent) => {
  if (event.eventPath[0]?.className?.includes('category-cell-expand')) {
    if (event.data.children) {
      dataTableStore.setExpanded(event.data.id);
      rowData.value = dataTableStore.getItemsToRender;
    }
  }
};

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
};

const defaultColDef = {
  flex: 1,
};
</script>
<style scoped>
#table {
  margin-top: 8px;
}
</style>
