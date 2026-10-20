class Notebook extends Item {
  static DUMP_KEY  = 'NOTEBOOK';   // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';   // На текущем этапе используем базовый интерфейс

  constructor(data) {
    super(data);
  }

}