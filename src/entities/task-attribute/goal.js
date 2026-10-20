class Goal extends ItemTree {
  static DUMP_KEY = 'GOAL';        // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';  // Тег кастомного HTML-элемента для отображения

  constructor(data) {
    super(data);
  }
}