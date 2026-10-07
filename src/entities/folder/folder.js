class Folder extends TaskAttribute {
  static ITEM_TYPE = 'FOLDER';
  static attribute = 'data.FOLDER';

  updateTasks() {
    const children = new Map([
      ...Task.filter([{ p: 'data.FOLDER', v: this.data.ID }]),
      ...Checklist.filter([{ p: 'data.FOLDER', v: this.data.ID }])
    ]);
    this.tasks = new Map([...children.entries()].sort((a, b) => {
      return (b[1].dataExt.completed - a[1].dataExt.completed)
      || ((a[1].dataExt.dueDate === "") - (b[1].dataExt.dueDate === ""))
      || (a[1].dataExt.dueDate.localeCompare(b[1].dataExt.dueDate));
    }));
  }

  updateUI() {
    this.ui.set({ innerHTML : '' });

    this.updateTasks();

    let currentDate = "ABC";
    
    this.tasks.forEach((task) => {
      if (task.dataExt.dueDate !== currentDate) {
        this.ui.append(new E('p').set({ textContent : task.dataExt.dueDate === "" ? "Без даты" : task.dataExt.dueDate }));
        currentDate = task.dataExt.dueDate;
      }
      this.ui.append(task.render());
    });
  }

}