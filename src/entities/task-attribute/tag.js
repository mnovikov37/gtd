class Tag extends Item {
  static ITEM_TYPE  = 'TAG';       // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';  // Использует базовый интерфейс отображения

  constructor(data) {
    super(data);
  }
}