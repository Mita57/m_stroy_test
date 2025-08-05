<template>
  <div id="table-controls">
    <div id="table-controls-toggle"
         @click="dataTableStore.toggleIsEditMode"
         @keydown="dataTableStore.toggleIsEditMode">
      Режим: {{dataTableStore.isEditMode ? 'Редактирование' : 'Просмотр'}}
    </div>
    <div id="table-controls-btn">
      <button :class="dataTableStore.getCanClickPrev ? '' : 'gray-out'"
              @click="dataTableStore.prevClick"
              @keydown="dataTableStore.prevClick"
      >
        <img src="../assets/arrow.svg" alt="Отменить">
      </button>
      <button id="table-controls-btn-repeat"
              :class="dataTableStore.getCanClickNext ? '' : 'gray-out'"
              @click="dataTableStore.redoClick"
              @keydown="dataTableStore.redoClick"
      >
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
.gray-out {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  filter: grayscale(100%);
  pointer-events: none;
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
