class Goal extends ItemTree {
  static ITEM_TYPE = 'GOAL';        // Ключ сущности в дампе данных
  static VIEW__SHOW = 'item-view';  // Тег кастомного HTML-элемента для отображения

  constructor(data) {
    super(data);
  }
}