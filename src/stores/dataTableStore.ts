import { defineStore } from 'pinia';
import TreeStore, { ItemMember, testItems } from '@/utils/TreeStore';

export type RootState = {
  treeStore: TreeStore,
  isEditMode: boolean,
};

interface ItemsWithChildren extends ItemMember{
  children: ItemsWithChildren;
}

export const useDataTableStore = defineStore('dataTable', {
  state: () => ({
    treeStore: new TreeStore(testItems),
    isEditMode: false,
  }) as RootState,
  getters: {
    getIsEditMode(state): boolean {
      return state.isEditMode;
    },
    getItems(state): ItemsWithChildren[] {
      const initItems: ItemMember[] = state.treeStore.getAll();
      // todo fixme?
      const nest = (items: ItemMember[], id: string | number | null = null): any => items
        .filter((item) => item.parent === id)
        .map((item) => ({ ...item, children: nest(items, item.id) }));
      return nest(initItems);
    },
    getItemsRaw(state): ItemMember[] {
      return state.treeStore.getAll();
    },
  },
  actions: {
    toggleIsEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    addItem(item: ItemMember) {
      this.treeStore.addItem(item);
    },
    updateItem(item: ItemMember) {
      this.treeStore.updateItem(item);
    },
    removeItem(id: string | number) {
      this.treeStore.removeItem(id);
    },
  },
});
