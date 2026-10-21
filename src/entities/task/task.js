class Task extends ItemTree {
  static DUMP_KEY  = 'TASK';       // Ключ сущности в дампе данных

  constructor(data) {
    super(data);
    this.view = TaskType.get(data.TYPE).data.VIEW; // Выбрать UI в зависимости от типа сущности
  }

}