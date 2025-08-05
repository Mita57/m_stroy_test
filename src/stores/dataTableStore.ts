import { defineStore } from 'pinia';
import TreeStore, { ItemMember, testItems } from '@/utils/TreeStore';

export type RootState = {
  treeStore: TreeStore,
  isEditMode: boolean,
  expandedNodes: (number | string)[],
};

interface ItemsWithChildren extends ItemMember{
  children: ItemsWithChildren[];
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
    getItems(state): ItemsWithChildren[] {
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
    getItemsToRender(state): ItemsWithChildren[] {
      const initItems: ItemsWithChildren[] = this.getItems;
      if (state.expandedNodes.length === 0) {
        return initItems;
      }
      const result: ItemsWithChildren[] = [];
      const getNodesToRender = (items: ItemsWithChildren[]) => {
        items.forEach((item) => {
          if (state.expandedNodes.includes(item.id)) {
            result.push(item);
            if (item.children) {
              getNodesToRender(item.children);
              // fixme
              result.push(...item.children.filter((chId) => !(state.expandedNodes
                .includes(chId.id))));
            }
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
