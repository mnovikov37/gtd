class ItemTree extends Item {
  static VIEW__SHOW = 'item-tree-view';      // Тег кастомного элемента HTML - интерфейса для отображения сущности

  children = new Map();

  static init(source) {
    super.init(source);
    this.pool.forEach(item => {
      if (item.data.PARENT !== 0) {
        const parentItem = this.get(item.data.PARENT);
        if (!parentItem) {
          throw new ReferenceError(`Not found parent [${item.data.PARENT}] for ${this.name} [${item.data.ID}]`);
        }
        parentItem.children.set(item.data.ID, item);
      }
    });
  }

}