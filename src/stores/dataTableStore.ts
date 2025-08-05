import { defineStore } from 'pinia';
import TreeStore, { ItemMember, testItems } from '@/utils/TreeStore';

export type RootState = {
  treeStore: TreeStore,
  isEditMode: boolean,
  expandedNodes: (number | string)[],
};

export interface ItemWithChildren extends ItemMember{
  children: ItemWithChildren[];
  nestingLevel: number;
}

export const useDataTableStore = defineStore('dataTable', {
  state: () => ({
    treeStore: new TreeStore(testItems),
    isEditMode: false,
    expandedNodes: [],
  }) as RootState,
  getters: {
    getIsEditMode(state): boolean {
      return state.isEditMode;
    },
    getItems(state): ItemWithChildren[] {
      const initItems: ItemMember[] = state.treeStore.getAll();
      // todo fixme?
      const nest = (
        items: ItemMember[],
        nestingLevel: number,
        id: string | number | null = null,
      ): any => items
        .filter((item) => item.parent === id)
        .map((item) => ({
          ...item,
          children: nest(items, nestingLevel + 1, item.id),
          expanded: false,
          nestingLevel,
        }));
      return nest(initItems, 0);
    },
    getItemsToRender(state): ItemWithChildren[] {
      const initItems: ItemWithChildren[] = this.getItems;
      if (!state.expandedNodes.includes(initItems[0].id)) {
        return initItems;
      }
      const result: ItemWithChildren[] = [];
      const getNodesToRender = (items: ItemWithChildren[]) => {
        items.forEach((item) => {
          result.push(item);
          if (state.expandedNodes.includes(item.id)) {
            getNodesToRender(item.children);
          }
        });
      };
      getNodesToRender(initItems);
      return result;
    },
  },
  actions: {
    toggleIsEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    setExpanded(id: number | string) {
      if (this.expandedNodes.includes(id)) {
        this.expandedNodes = this.expandedNodes.filter((nodeId) => nodeId !== id);
      } else {
        this.expandedNodes.push(id);
      }
    },
    addItem(parentId: number | string) {
      const latestId = Number(this.treeStore.getAll().slice(-1).pop()?.id);
      const newItem: ItemMember = {
        label: 'New label',
        parent: parentId,
        id: latestId,
      };
      this.treeStore.addItem(newItem);
      this.expandedNodes.push(parentId);
    },
    updateItem(item: ItemMember) {
      this.treeStore.updateItem(item);
    },
    removeItem(id: string | number) {
      this.treeStore.removeItem(id);
    },
  },
});
