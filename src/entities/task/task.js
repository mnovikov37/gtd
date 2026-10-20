class Task extends ItemTree {
  static DUMP_KEY  = 'TASK';       // Ключ сущности в дампе данных
  static VIEW__SHOW = 'task-view';  // На текущем этапе используем базовый интерфейс

  constructor(data) {
    super(data);
  }

}