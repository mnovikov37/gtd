class Task extends ItemTree {
  static DUMP_KEY  = 'TASK';       // Ключ сущности в дампе данных
  
  get type() {
    return TaskType.get(this.data.TYPE);
  }

  constructor(data) {
    super(data);
    this.view = this.type.data.VIEW; // Выбрать UI в зависимости от типа сущности
  }

  get childrenFilter() {
    const filter = super.childrenFilter;
    filter.push({ p: 'data.TYPE', v: this.type.data.CHILDREN_TYPES });
    return filter;
  }

}