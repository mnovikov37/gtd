class Kanban extends DOMElement {

  static FOLDERS = [
    { ID: 2, TITLE: "ВХОДЯЩЕЕ"         },
    { ID: 1, TITLE: "СЕЙЧАС"           },
    { ID: 3, TITLE: "ПОЗЖЕ"            },
    { ID: 4, TITLE: "НА ЧУЖОЙ СТОРОНЕ" },
    { ID: 7, TITLE: "АРХИВ" }
  ];

  static FILTER_EVENT = 'KANBAN__FILTER_CHANGE';

  filter;

  constructor() {
    super();

    this.filter = new Filter(this.constructor.FILTER_EVENT);

    this.ui.addClass('kanban');
    this.ui.addEventListener(this.constructor.FILTER_EVENT, (e) => {
      this.updateUI();
    });
    this.ui.addEventListener(Item.EVENT__SAVE, (e) => {
      this.updateUI();
    }, true)
    this.ui.titles = new E('div').addClass('kanban__folders');
      this.constructor.FOLDERS.forEach(folder => {
        this.ui.titles.append(new E('p').set({ textContent : folder.TITLE }).addClass('kanban__folder_title'));
      });

    this.ui.content = new E('div').addClass('kanban__content');

    this.ui.append(this.filter.render(), this.ui.titles, this.ui.content);
  }

  renderFolder(tasks) {
    const result = new E('div');

    const renderedTasks = new Map([...tasks.entries()].sort((a, b) => {
      return (b[1].completed() - a[1].completed())
      || ((a[1].dueDate() === "") - (b[1].dueDate() === ""))
      || (a[1].dueDate().localeCompare(b[1].dueDate())
      || (a[1].data.TITLE.localeCompare(b[1].data.TITLE)));
    }));

    let currentDate = "ABC";
    
    renderedTasks.forEach((task) => {
      const dueDate = task.dueDate();
      if (dueDate !== currentDate) {
        result.append(new E('p').set({ textContent : dueDate === "" ? "Без даты" : dueDate }));
        currentDate = dueDate;
      }
      let viewElement;
      if (taskModel.data.TYPE === ChecklistModel.TYPE) {
        viewElement = new ChecklistView(taskModel);
      } else {
        viewElement = new TaskView(taskModel);
      }
      // viewElement — это чистый HTMLElement, пушим напрямую в DOM
      result.append(viewElement);
    });
 
    return result;
  }

  renderFolders(tasks) {
    console.log(tasks);
    const result = new E('div').addClass('kanban__folders');
    this.constructor.FOLDERS.forEach(folder => {
      console.log(Folder.filterCondition(folder.ID));
      console.log(filterMap(tasks, [Folder.filterCondition(folder.ID)]));
      result.append(this.renderFolder(filterMap(tasks, [Folder.filterCondition(folder.ID)])));
    });
    return result;
  }

  renderFoldersFromAttributes(tasks, attrs) {
    const conditions = [];
    /*
    if (attrs.goal) { conditions.push(Goal.filterCondition(attrs.goal)); }
    if (attrs.project) { conditions.push(Project.filterCondition(attrs.project)); }
    if (attrs.context) { conditions.push(Context.filterCondition(attrs.context)); }
    */
    const result = this.renderFolders(tasks);
    return result;
  }


  updateUI() {
    this.ui.content.clear();
    const f = this.filter.filter;
    const conditions = [/*{ p : 'data.TYPE', v: 2 }*/];
    let optionProject = null;
    if (f.goal !== Select.OPTION_ANY__VALUE) conditions.push(Goal.filterCondition(f.goal, true));           // Цели сущность иерархическая
    if (f.project !== Select.OPTION_ANY__VALUE) {
      conditions.push(Project.filterCondition(f.project, true));  // Проекты сущность иерархическая
      optionProject = Project.makeSelectOptionForId(f.project)
    }
    if (f.context !== Select.OPTION_ANY__VALUE) conditions.push(Context.filterCondition(f.context));        // Контексты сущность НЕ иерархическая
    const tasks = new Map([...Task.filter(conditions), ...Checklist.filter(conditions)]);
    console.log(tasks);
    this.ui.content.append(new E('p').addClass('kanban__project_title').set({ textContent : optionProject?.title }));
    const foldersUi = this.renderFoldersFromAttributes(tasks, { project : optionProject?.value });
    this.ui.content.append(foldersUi);
    optionProject?.children?.forEach(c => {
      this.ui.content.append(new E('p').addClass('kanban__project_title').set({ textContent : `${optionProject?.title} >> ${c.title}` }));
      const foldersUi = this.renderFoldersFromAttributes(tasks, { project : c.value });
      this.ui.content.append(foldersUi);
    });
  }
}