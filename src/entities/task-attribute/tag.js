class Tag extends Item {
  static DUMP_KEY  = 'TAG';       // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';  // Использует базовый интерфейс отображения

  constructor(data) {
    super(data);
  }
}