import { defineStore } from 'pinia';
import TreeStore, { testItems, ItemMember } from '@/utils/TreeStore';

const ACTIONS_MAX_LENGTH = 10; // max length will be 10, so that it doesn't take too much resource

interface Operation {
  action: 'delete' | 'update' | 'add',
  value : ItemMember,
  valueNew?: ItemMember,
}

export type RootState = {
  treeStore: TreeStore,
  isEditMode: boolean,
  expandedNodes: (number | string)[],
  operations: Operation[],
  currentCancelStep: number,
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
    operations: [],
    currentCancelStep: 0,
  }) as RootState,
  getters: {
    getIsEditMode(state): boolean {
      return state.isEditMode;
    },
    getCanClickPrev(state): boolean {
      return ((state.operations.length > state.currentCancelStep) && state.operations.length > 0);
    },
    getCanClickNext(state): boolean {
      return (state.operations.length > 0 && state.currentCancelStep !== 0);
    },
    getItems(state): ItemWithChildren[] {
      const initItems: ItemMember[] = state.treeStore.getAll();
      const nest = (
        items: ItemMember[],
        nestingLevel: number,
        id: string | number | null = null,
      ): ItemWithChildren[] => items
        .filter((item) => item.parent === id)
        .map((item) => ({
          ...item,
          children: nest(items, nestingLevel + 1, item.id),
          expanded: this.expandedNodes.includes(item.id),
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
    prevClick() {
      this.currentCancelStep += 1;
      switch (this.operations[this.currentCancelStep - 1]?.action) {
        case 'delete': {
          this.treeStore.addItem(this.operations[this.currentCancelStep - 1].value);
          break;
        }
        case 'update': {
          this.treeStore.updateItem(this.operations[this.currentCancelStep - 1].value);
          break;
        }
        case 'add': {
          this.treeStore.removeItem(this.operations[this.currentCancelStep - 1].value.id);
          break;
        }
        default: {
          break;
        }
      }
    },
    redoClick() {
      this.currentCancelStep -= 1;
      switch (this.operations[this.currentCancelStep]?.action) {
        case 'add': {
          this.treeStore.addItem(this.operations[this.currentCancelStep].value);
          break;
        }
        case 'update': {
          this.treeStore.updateItem(this.operations[this.currentCancelStep].valueNew!);
          break;
        }
        case 'delete': {
          this.treeStore.removeItem(this.operations[this.currentCancelStep].value.id);
          break;
        }
        default: {
          break;
        }
      }
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
      this.addOperation({
        action: 'add',
        value: newItem,
      });
      if (this.currentCancelStep !== 0) {
        this.operations.splice(this.currentCancelStep - this.operations.length);
        this.currentCancelStep = 0;
      }
      this.treeStore.addItem(newItem);
      this.expandedNodes.push(parentId);
    },
    updateItem(newItem: ItemMember) {
      const value: ItemMember | undefined = this.treeStore.getAll()
        .find((item) => item.id === newItem.id);
      if (value) {
        this.addOperation({
          action: 'update',
          valueNew: newItem,
          value,
        });
      }
      this.treeStore.updateItem(newItem);
      if (this.currentCancelStep !== 0) {
        this.operations.splice(this.currentCancelStep - this.operations.length);
        this.currentCancelStep = 0;
      }
    },
    removeItem(id: string | number) {
      const value = this.getItems.find((item) => item.id === id);
      if (value) {
        this.addOperation({
          action: 'update',
          value,
        });
      }
      this.treeStore.removeItem(id);
      if (this.currentCancelStep !== 0) {
        this.operations.splice(this.currentCancelStep - this.operations.length);
        this.currentCancelStep = 0;
      }
    },
    addOperation(op: Operation) {
      if (this.operations.length > ACTIONS_MAX_LENGTH) {
        this.operations.shift();
      }
      this.operations.push(op);
    },
  },
});
