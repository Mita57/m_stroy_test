import TreeStore, { testItems } from '@/utils/TreeStore';
import { setActivePinia, createPinia } from 'pinia'
import { useDataTableStore } from '@/stores/dataTableStore';

import { mount } from '@vue/test-utils';
// import App from '@/main';

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
describe('Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test("Check basic getters", () => {
    const store = useDataTableStore();
    expect(store.getItems.length).toBe(1);
    expect(store.getItemsToRender.length).toBe(1);
    expect(store.getCanClickNext).toBe(false);
    expect(store.getCanClickPrev).toBe(false);
    expect(store.getIsEditMode).toBe(false);
    expect(store.treeStore.getAll().length).toBe(9);
  });

  test("Toggle edit mode", () => {
    const store = useDataTableStore();
    store.toggleIsEditMode();
    expect(store.getIsEditMode).toBe(true);
  });

  test("Add item", () => {
    const store = useDataTableStore();
    store.addItem('2');
    expect(store.getCanClickNext).toBe(false);
    expect(store.getCanClickPrev).toBe(true);
    expect(store.treeStore.getAll().length).toBe(10);
    expect(store.operations.length).toBe(1);
  });

  test("Click previous", () => {
    const store = useDataTableStore();
    store.addItem('2');
    store.prevClick();
    expect(store.getCanClickPrev).toBe(false);
    expect(store.treeStore.getAll().length).toBe(11);
    expect(store.operations.length).toBe(1);
  });

})
// not working yet
// describe('Frontend', () => {
//   beforeEach(() => {
//     setActivePinia(createPinia())
//   })
//   const wrapper = mount(App);
//
//
//   test('Does a wrapper exist', () => {
//     expect(wrapper.exists()).toBe(true)
//   })
//   it('Renders something', () => {
//     expect(wrapper.html()).toContain('<button>')
//   })
// })
//
//
