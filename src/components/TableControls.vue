<template>
  <div id="table-controls">
    <div id="table-controls-toggle"
         @click="dataTableStore.toggleIsEditMode()"
         @keydown="dataTableStore.toggleIsEditMode()">
      Режим: {{dataTableStore.isEditMode ? 'Редактирование' : 'Просмотр'}}
    </div>
    <div id="table-controls-btn">
      <button>
        <img src="../assets/arrow.svg" alt="Отменить">
      </button>
      <button id="table-controls-btn-repeat">
        <img src="../assets/arrow.svg" alt="Повторить">
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDataTableStore } from '@/stores/dataTableStore';

const dataTableStore = useDataTableStore();
</script>

<style scoped>
#table-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: dodgerblue;
}
#table-controls-toggle:hover {
  text-decoration: underline;
  cursor: pointer;
}
img {
  height: 20px;
}
button {
  background: none;
  border: none;
  cursor: pointer;
  transition-duration: 0.3s;
}
button:hover {
  background: #baf4ff;
}
#table-controls-btn {
  margin-left: 8px;
  display: flex;
  flex-direction: row;
  gap: 4px;
}
#table-controls-btn-repeat {
  transform: scale(-1, 1)
}
</style>
