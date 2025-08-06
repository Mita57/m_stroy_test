<template>
  <div>
    <TableControls />
    <DataTable />
  </div>
</template>

<script lang="ts" setup>
import TableControls from '@/components/TableControls.vue';
import DataTable from '@/components/DataTable.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
