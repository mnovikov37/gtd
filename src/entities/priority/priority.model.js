class Priority extends TaskAttribute {
  static ITEM_TYPE = 'PRIORITY';
  static PRIORITIES = [
    {ID :  3, TITLE : '🔴 Всш'  },
    {ID :  2, TITLE : '🟠 Выс'  },
    {ID :  1, TITLE : '🟡 Сред' },
    {ID :  0, TITLE : '🔵 Низ'  },
    {ID : -1, TITLE : '⚪ -'    }
  ];
}