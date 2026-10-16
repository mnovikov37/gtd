class Notebook extends Item {
  static ITEM_TYPE  = 'NOTEBOOK';   // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';   // На текущем этапе используем базовый интерфейс

  constructor(data) {
    super(data);
  }

}