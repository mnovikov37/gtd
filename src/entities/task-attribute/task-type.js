class TaskType extends Item {
  static DUMP_KEY  = 'TYPE';  // Ключ сущности в дампе данных

  static get TASK_TYPE__TASK()           { return 0 }
  static get TASK_TYPE__PROJECT()        { return 1 }
  static get TASK_TYPE__CHECKLIST()      { return 2 }
  static get TASK_TYPE__CHECKLIST_ITEM() { return 3 }

  static pool = new Map([
    [
      this.TASK_TYPE__TASK, new TaskType({
      ID             : this.TASK_TYPE__TASK,
      TITLE          : 'Задача',
      VIEW           : 'task-view',
      CHILDREN_TYPES : []
    })],
    [
      this.TASK_TYPE__PROJECT, new TaskType({
      ID             : this.TASK_TYPE__PROJECT,
      TITLE          : 'Проект',
      VIEW           : 'project-view',
      CHILDREN_TYPES : [ this.TASK_TYPE__PROJECT, this.TASK_TYPE__TASK ]
    })],
    [
      this.TASK_TYPE__CHECKLIST, new TaskType({
      ID             : this.TASK_TYPE__CHECKLIST,
      TITLE          : 'Чеклист',
      VIEW           : 'checklist-view',
      CHILDREN_TYPES : [ this.TASK_TYPE__CHECKLIST_ITEM ]
    })],
    [
      this.TASK_TYPE__CHECKLIST_ITEM, new TaskType({
      ID             : this.TASK_TYPE__CHECKLIST_ITEM,
      TITLE          : 'Пункт чеклиста',
      VIEW           : 'checklist-item-view',
      CHILDREN_TYPES : []
    })]
  ]);

}