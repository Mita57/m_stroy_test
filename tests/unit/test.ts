import TreeStore, { testItems } from '../../src/utils/TreeStore';

describe("Validate TreeStore Class", () => {
  const treeStore = new TreeStore(testItems);

  test("Check getAll", () => {
    expect(treeStore.getAll().length).toBe(8);
  });

  test("Check get item", () => {
    expect(treeStore.getItem('2')).toBeTruthy();
  });
  test("Check get item undefined", () => {
    expect(treeStore.getItem('foo')).toBeUndefined();
  });
  test("Check get children", () => {
    expect(treeStore.getChildren('2').filter((ch) =>
      ch.parent === '2').length).toBe(3);
  });
  test("Check get all parents", () => {
    expect(treeStore.getAllParents(8).length).toBe(4);
  });
  test("Check get new Item", () => {
    treeStore.addItem({id: 'foo', parent: 1, label: 'bar'})
    expect(treeStore.getItem('foo')).toBeTruthy();
  });
  test("Check updated Item", () => {
    treeStore.updateItem({id: 'foo', parent: 1, label: 'zar'})
    expect(treeStore.getItem('foo')).toBeTruthy();
  });
  test("Deletion worked", () => {
    treeStore.removeItem('foo');
    expect(treeStore.getItem('foo')).toBeUndefined();
  });
});
