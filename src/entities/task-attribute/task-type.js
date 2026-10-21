class TaskType extends Item {
  static DUMP_KEY  = 'TYPE';  // Ключ сущности в дампе данных

  static pool = new Map([
    [  0, new TaskType({ ID :  0, TITLE : 'Задача'        , VIEW: 'task-view'           }) ],
    [  1, new TaskType({ ID :  1, TITLE : 'Проект'        , VIEW: 'project-view'        }) ],
    [  2, new TaskType({ ID :  2, TITLE : 'Чеклист'       , VIEW: 'checklist-view'      }) ],
    [  3, new TaskType({ ID :  3, TITLE : 'Пункт чеклиста', VIEW: 'checklist-item-view' }) ]
  ]);

}