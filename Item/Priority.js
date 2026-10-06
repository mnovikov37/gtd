class Priority extends TaskAttribute {
  static PRIORITIES = [
    {ID :  3, TITLE : '🔴 Всш'  },
    {ID :  2, TITLE : '🟠 Выс'  },
    {ID :  1, TITLE : '🟡 Сред' },
    {ID :  0, TITLE : '🔵 Низ'  },
    {ID : -1, TITLE : '⚪ -'    }
  ];

  updateUI() {
    this.ui.set({ textContent : `Приоритет [${this.data.TITLE}]` });
  }

  static makeSelectOptions() {
    const result = [];
    //console.log(sortedPool);
    this.PRIORITIES.forEach((item) => {
      result.push({ title : item.TITLE, value : item.ID });
    });
    return result;
  }
}