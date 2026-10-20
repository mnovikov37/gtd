class Priority extends Item {
  static DUMP_KEY  = 'PRIORITY';  // Ключ сущности в дампе данных

  static pool = new Map([
    [  3, new Priority({ ID :  3, TITLE : '🔴 Всш'  }) ],
    [  2, new Priority({ ID :  2, TITLE : '🟠 Выс'  }) ],
    [  1, new Priority({ ID :  1, TITLE : '🟡 Сред' }) ],
    [  0, new Priority({ ID :  0, TITLE : '🔵 Низ'  }) ],
    [ -1, new Priority({ ID : -1, TITLE : '⚪ -'    }) ]
  ]);

  static PRIORITIES = [
    
  ];
}