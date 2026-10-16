class ItemTree extends Item {

  static init(source) {
    super.init(source);
    this.poolFlat.forEach(item => {
      if (item.data.PARENT !== 0) {
        this.get(item.data.PARENT).dataExt.children.set(item.data.ID, item);
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