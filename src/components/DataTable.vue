<template>
  <div id='table'>
    <ag-grid-vue
      style='width: 100%; height: 650px'
      :columnDefs='colDefs'
      :rowData='rowData'
      @grid-ready="onGridReady"
      :defaultColDef='defaultColDef'
    >
    </ag-grid-vue>
  </div>
</template>

<script lang='ts' setup>
import {
  onMounted, ref, shallowRef, defineExpose,
} from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useDataTableStore } from '@/stores/dataTableStore';
import { ItemMember } from '@/utils/TreeStore';
import getCols, { IRow } from '@/utils/getCols';
import CategoryCell from '@/components/CategoryCell.vue';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridApi = shallowRef<GridApi<IRow> | null>(null);
const dataTableStore = useDataTableStore();
const isEditMode = ref<boolean>(false);
const rowData = ref<ItemMember[]>([]);
const colDefs = ref<ColDef<IRow>[]>(getCols(false));
onMounted(() => {
  rowData.value = dataTableStore.getItems;
  console.log(dataTableStore.getItems);
  isEditMode.value = dataTableStore.isEditMode;
  dataTableStore.$subscribe((mutation) => {
    if (mutation.events?.key === 'isEditMode') {
      console.log(gridApi);
        gridApi.value!.setGridOption('columnDefs', getCols(mutation.events.newValue));
    }
  });
});
defineExpose({ CategoryCell });

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
