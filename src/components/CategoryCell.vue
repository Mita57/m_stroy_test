<template>
  <div class="category-cell">
    <div class="category-cell-text">
      <img src="../assets/expand.svg"
           alt="Развернуть"
           v-if="props.params.data.children"
      >
      {{props.params.data.children ? 'Группа' : 'Элемент'}}
    </div>
    <div class="category-cell-actions" v-if="dataTableStore.isEditMode">
      <button v-on:click="addClicked"
              class="category-cell-actions-btn">
        <img src="../assets/add.svg" alt="Добавить">
      </button>
      <button v-on:click="deleteClicked"
              class="category-cell-actions-btn">
        <img src="../assets/delete.svg" alt="Удалить">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive } from 'vue';
import { ICellRendererParams } from 'ag-grid-community';
import { useDataTableStore } from '@/stores/dataTableStore';

const dataTableStore = useDataTableStore();

const props = defineProps<{
  params: ICellRendererParams,
}>();

const addClicked = (): void => {
  console.log(props.params);
};

const deleteClicked = (): void => {
  console.log(props.params);
};
// fixme style scope doesn't work for whatever reason

</script>

<style>
.category-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.category-cell-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.category-cell-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
}
.category-cell-actions-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition-duration: 0.3s;
}
button:hover {
  background: #baf4ff;
}
img {
  height: 20px;
}
</style>
