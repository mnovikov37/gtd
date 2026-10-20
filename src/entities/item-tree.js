class ItemTree extends Item {
  static VIEW__SHOW = 'item-tree-view';      // Тег кастомного элемента HTML - интерфейса для отображения сущности

  static init(source) {
    super.init(source);
    this.pool.forEach(item => {
      if (item.data.PARENT !== 0) {
        const parentItem = this.get(item.data.PARENT);
        if (!parentItem) {
          throw new ReferenceError(`Not found parent [${item.data.PARENT}] for ${this.name} [${item.data.ID}]`);
        }
        parentItem.dataExt.children.set(item.data.ID, item);
      }
    });
  }


  constructor(data) {
    super(data);
    
    this.dataExt = {
      children: new Map() // Карта дочерних объектов (ключ - ID, значение - объект)
    };
  }
}