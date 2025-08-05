import It = jest.It;

export interface ItemMember {
  id: number | string;
  parent: string | number | null;
  [propName: string]: any;
}

export const testItems = [
  { id: 1, parent: null, label: 'Item 1' },

  { id: '2', parent: 1, label: 'Item 2' },
  { id: 3, parent: 1, label: 'Item 3' },

  { id: 4, parent: '2', label: 'Item 4' },
  { id: 5, parent: '2', label: 'Item 5' },
  { id: 6, parent: '2', label: 'Item 6' },

  { id: 7, parent: 4, label: 'Item 7' },
  { id: 8, parent: 4, label: 'Item 8' },

];

export default class TreeStore {
  items: ItemMember[];

  constructor(items: ItemMember[]) {
    this.items = items;
  }

  public getAll(): ItemMember[] {
    return this.items;
  }

  public getItem(id: string | number): ItemMember | undefined {
    return this.items.find((item) => item.id === id);
  }

  public getChildren(id: string | number): ItemMember[] {
    return this.items.filter((item) => item.parent === id);
  }

  public getAllChildren(id: string | number): ItemMember[] {
    const result: ItemMember[] = [];
    const getItems = (parentIds: (number | string | null)[]) => {
      const newParentIds: (string | number)[] = [];
      this.items.forEach((item: ItemMember) => {
        if (parentIds.includes(item.parent)) {
          result.push(item);
          if (item.parent !== null) {
            newParentIds.push(item.id);
          }
        }
      });
      if (newParentIds.length > 0) {
        getItems(newParentIds);
      }
    };
    getItems([id]);
    return result;
  }

  public getAllParents(id: number | string): ItemMember[] {
    const result: ItemMember[] = [];
    const getParent = (childId: number | string | null) => {
      const found = this.items.find((item) => item.id === childId);
      if (found) {
        result.push(found);
        getParent(found.parent);
      }
    };
    getParent(id);
    return result;
  }

  public addItem(item: ItemMember): void {
    this.items.push(item);
  }

  public removeItem(id: number | string): void {
    this.items = this.items.filter((item) => item.id !== id && item.parent !== id);
  }

  public updateItem(updatedItem: ItemMember): void {
    this.items = this.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  }
}

const test = new TreeStore(testItems);

// console.log(test.getAll());
// console.log(test.getItem('2'));
// console.log(test.getChildren('2'));
// console.log(test.getAllChildren('2'));
// console.log(test.getAllParents(8));
// test.addItem({id: 'check', parent: 1, label: 'checking'});
// console.log(test.getAll());
// test.updateItem({id: 'check', parent: 1, label: 'Hello'})
// console.log(test.getAll());
// test.removeItem('check');
// console.log(test.getAll());
