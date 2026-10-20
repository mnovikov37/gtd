class TaskType extends Item {
  static DUMP_KEY  = 'TYPE';  // Ключ сущности в дампе данных

  static pool = new Map([
    [  0, new TaskType({ ID :  0, TITLE : 'Задача'          }) ],
    [  1, new TaskType({ ID :  1, TITLE : 'Проект'          }) ],
    [  2, new TaskType({ ID :  2, TITLE : 'Чеклист'         }) ],
    [  3, new TaskType({ ID :  3, TITLE : 'Пункт чеклиста'  }) ]
  ]);

}