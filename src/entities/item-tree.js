class ItemTree extends Item {
  static VIEW__SHOW = 'item-tree-view';      // Тег кастомного элемента HTML - интерфейса для отображения сущности
  get childrenFilter() {
    return [{ p: 'data.PARENT', v: this.data.ID }];
  }

  get children() {
    console.log(this.childrenFilter);
    const result = this.constructor.filter(this.childrenFilter);
    return new Map([...result.entries()].sort((a, b) => (a[1].data.TITLE.localeCompare(b[1].data.TITLE))));
  }
}