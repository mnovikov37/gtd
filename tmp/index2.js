/** ------------------------------------------------------------ */
/** src/entities/context/context.view.js */
/** ------------------------------------------------------------ */
class ContextView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('attribute-tag_type_context');
  }
}
customElements.define('context-view', ContextView);

/** ------------------------------------------------------------ */
/** src/entities/priority/priority.model.js */
/** ------------------------------------------------------------ */
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

/** ------------------------------------------------------------ */
/** src/entities/priority/priority.view.js */
/** ------------------------------------------------------------ */
class PriorityView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(`attribute-tag_priority_${this.model.data.ID}`);
  }
}
customElements.define('priority-view', PriorityView);

/** ------------------------------------------------------------ */
/** src/entities/goal/goal.model.js */
/** ------------------------------------------------------------ */
class Goal extends TaskAttribute {
  static ITEM_TYPE = 'GOAL';
}

/** ------------------------------------------------------------ */
/** src/entities/goal/goal.view.js */
/** ------------------------------------------------------------ */
class GoalView extends TaskAttributeView {
  #childrenContainer;

  constructor(model) {
    super(model);
    this.classList.add('attribute-tag_type_goal');
    
    // Создаем контейнер для подцелей с отступом
    this.#childrenContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'attribute-tag__children');
    this.append(this.#childrenContainer);
  }

  updateUI() {
    // Чтобы не затереть контейнер детей, обновляем только текстовый узел самого элемента
    const titleNode = this.firstChild && this.firstChild.nodeType === Node.TEXT_NODE 
      ? this.firstChild 
      : document.createTextNode('');
    
    titleNode.textContent = this.model.data.TITLE;
    if (!this.contains(titleNode)) this.prepend(titleNode);

    this.#childrenContainer.clear();
    
    // Рекурсивно рендерим все подцели
    this.model.dataExt.children.forEach(childModel => {
      this.#childrenContainer.append(new GoalView(childModel));
    });
  }
}
customElements.define('goal-view', GoalView);

/** ------------------------------------------------------------ */
/** src/entities/project/project.model.js */
/** ------------------------------------------------------------ */
class Project extends TaskAttribute {
  static ITEM_TYPE = 'PROJECT';
  static TYPE = 2; // Тип "Проект" внутри общего массива задач
}

/** ------------------------------------------------------------ */
/** src/entities/project/project.view.js */
/** ------------------------------------------------------------ */
class ProjectView extends TaskAttributeView {
  #childrenContainer;

  constructor(model) {
    super(model);
    this.classList.add('attribute-tag_type_project');
    
    this.#childrenContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'attribute-tag__children');
    this.append(this.#childrenContainer);
  }

  updateUI() {
    const titleNode = this.firstChild && this.firstChild.nodeType === Node.TEXT_NODE 
      ? this.firstChild 
      : document.createTextNode('');
    
    titleNode.textContent = this.model.data.TITLE;
    if (!this.contains(titleNode)) this.prepend(titleNode);

    this.#childrenContainer.clear();
    
    // Рекурсивно рендерим подпроекты
    this.model.dataExt.children.forEach(childModel => {
      this.#childrenContainer.append(new ProjectView(childModel));
    });
  }
}
customElements.define('project-view', ProjectView);

/** ------------------------------------------------------------ */
/** src/entities/task/task.model.js */
/** ------------------------------------------------------------ */
class Task extends TaskTemplate {
  static TYPE = 1; // Уникальный идентификатор типа "Задача"

  constructor(data) {
    super(data);
  }

  // Бизнес-логика получения связанных текстовых данных
  getFolderTitle() {
    const folder = Folder.get(this.data.FOLDER);
    return folder ? folder.data.TITLE : 'Без папки';
  }

  getProjectTitle() {
    const project = Project.get(this.data.PROJECT);
    return project ? project.data.TITLE : 'Без проекта';
  }

  getPriorityTitle() {
    const priority = Priority.get(this.data.PRIORITY);
    return priority ? priority.data.TITLE : 'Обычный';
  }

  getContextTitle() {
    const context = Context.get(this.data.CONTEXT);
    return context ? context.data.TITLE : 'Без контекста';
  }

  getDueDate() {
    return this.data.DUE_DATE || '';
  }
}

/** ------------------------------------------------------------ */
/** src/entities/task/task.view.js */
/** ------------------------------------------------------------ */
class TaskView extends TaskTemplateView {
  // Неинтерактивные элементы отображения атрибутов
  #folderField;
  #projectField;
  #priorityField;
  #contextField;
  #dateField;

  constructor(model) {
    super(model);

    // Добавляем специфичный класс для стилизации задач
    this.classList.add('item_type_task');

    // Инициализируем неинтерактивные «кирпичики» для блока деталей
    this.#folderField = new AppField('Папка');
    this.#projectField = new AppField('Проект');
    this.#priorityField = new AppField('Приоритет');
    this.#contextField = new AppField('Контекст');
    this.#dateField = new AppField('Срок');

    // Нативно аппендим все поля в скрытый блок деталей базового ItemView
    this.appendDetail(this.#folderField)
        .appendDetail(this.#projectField)
        .appendDetail(this.#priorityField)
        .appendDetail(this.#contextField)
        .appendDetail(this.#dateField);
  }

  updateUI() {
    super.updateUI(); // Обновит шапку, чекбокс и заметку

    // Наполняем кирпичики текстовыми значениями из модели (вместо селектов!)
    this.#folderField.setField(document.createElement('span').chain('set', { textContent: this.model.getFolderTitle() }));
    this.#projectField.setField(document.createElement('span').chain('set', { textContent: this.model.getProjectTitle() }));
    this.#priorityField.setField(document.createElement('span').chain('set', { textContent: this.model.getPriorityTitle() }));
    this.#contextField.setField(document.createElement('span').chain('set', { textContent: this.model.getContextTitle() }));
    
    const dueDate = this.model.getDueDate();
    this.#dateField.setField(document.createElement('span').chain('set', { textContent: dueDate || 'Не задан' }));
  }
}

customElements.define('task-view', TaskView);

/** ------------------------------------------------------------ */
/** src/entities/task/checklist.model.js */
/** ------------------------------------------------------------ */
class Checklist extends TaskTemplate {
  static TYPE = 3; // Уникальный идентификатор типа "Чеклист"

  constructor(data) {
    super(data);
  }

  // Получить все дочерние пункты этого чеклиста, отсортированные по ID
  getChildren() {
    const conditions = [{ p: 'data.PARENT', v: this.data.ID }];
    return [...ChecklistItem.filter(conditions).values()].sort((a, b) => a.data.ID - b.data.ID);
  }
}

/** ------------------------------------------------------------ */
/** src/entities/task/checklist.view.js */
/** ------------------------------------------------------------ */
class ChecklistView extends TaskTemplateView {
  #itemsContainer;

  constructor(model) {
    super(model);
    this.classList.add('item_type_checklist');

    // Создаем обертку для списка подпунктов
    this.#itemsContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'checklist__items-box');

    // Оборачиваем контейнер в кирпичик Field для красивого выравнивания структуры
    const checklistField = new AppField('Пункты чеклиста', this.#itemsContainer);
    
    this.appendDetail(checklistField);
  }

  updateUI() {
    super.updateUI(); // Обновляет базовое состояние

    this.#itemsContainer.clear(); // Полностью нативная очистка контейнера через AppElement/HTMLElement

    const childrenModels = this.model.getChildren();

    if (childrenModels.length === 0) {
      this.#itemsContainer.textContent = 'Чеклист пуст';
      return;
    }

    // Рендерим каждый подпункт в режиме "только для чтения"
    childrenModels.forEach(itemModel => {
      const itemRow = document.createElement('div')
        .chain('setAttribute', 'class', 'checklist__item-row');

      // Неинтерактивный мини-чекбокс
      const chk = document.createElement('input')
        .chain(Object.assign, { type: 'checkbox', disabled: true, checked: itemModel.data.COMPLETED !== "" })
        .chain('setAttribute', 'class', 'task__check task__check_type_list-item');

      // Текст подпункта
      const txt = document.createElement('span')
        .chain('setAttribute', 'class', 'checklist__item-text')
        .chain('set', { textContent: itemModel.data.TITLE });
        
      if (itemModel.data.COMPLETED !== "") {
        txt.classList.add('item__header_checked');
      }

      itemRow.chain('append', chk, txt);
      this.#itemsContainer.append(itemRow);
    });
  }
}

customElements.define('checklist-view', ChecklistView);

/** ------------------------------------------------------------ */
/** src/entities/task/checklist-item.model.js */
/** ------------------------------------------------------------ */
class ChecklistItem extends TaskTemplate {
  static TYPE = 3; // Тип сущности внутри дампа задач

  constructor(data) {
    super(data);
  }

  // Получить название родительского чеклиста для вывода в деталях
  getChecklistTitle() {
    // Ищем родительский чеклист в пуле моделей ChecklistModel
    const parentChecklist = ChecklistModel.get(this.data.PARENT);
    return parentChecklist ? parentChecklist.data.TITLE : 'Без чеклиста';
  }
}

/** ------------------------------------------------------------ */
/** src/entities/task/checklist-item.view.js */
/** ------------------------------------------------------------ */
class ChecklistItemView extends TaskTemplateView {
  #parentChecklistField;

  constructor(model) {
    super(model);
    
    // Добавляем BEM-класс для специфичной стилизации подпункта
    this.classList.add('item_type_checklist-item');

    // Настраиваем шапку: меняем стиль чекбокса на круглый, как было в вашем оригинальном CSS
    const checkbox = this.querySelector('.task__check');
    if (checkbox) {
      checkbox.classList.add('task__check_type_list-item');
    }

    // Создаем неинтерактивное поле "Чеклист" (вместо старого селекта) для блока деталей
    this.#parentChecklistField = new AppField('Чеклист');
    
    this.appendDetail(this.#parentChecklistField);
  }

  updateUI() {
    super.updateUI(); // Обновляет базовое состояние, чекбокс и текст заголовка

    // Наполняем текстовым значением из модели
    const parentTitle = this.model.getChecklistTitle();
    this.#parentChecklistField.setField(
      document.createElement('span').chain('set', { textContent: parentTitle })
    );
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('checklist-item-view', ChecklistItemView);

/** ------------------------------------------------------------ */
/** src/_features/add-task/add-task.js */
/** ------------------------------------------------------------ */
class AddTask extends DOMElement{
  static TYPE = 0;
  static DATA = {
		"UUID": "",
		"PARENT": 0,
		"TITLE": "",
		"START_DATE": "",
		"START_TIME_SET": 0,
		"DUE_DATE": "",
		"DUE_DATE_PROJECT": "",
		"DUE_TIME_SET": 0,
		"DUE_DATE_MODIFIER": "0",
		"REMINDER": -1,
		"ALARM": "",
		"REPEAT_NEW": "",
		"REPEAT_FROM": 0,
		"DURATION": 0,
		"STATUS": 0,
		"CONTEXT": 0,
		"GOAL": 0,
		"FOLDER": 0,
		"TAG": [],
		"STARRED": 0,
		"PRIORITY": 0,
		"NOTE": "",
		"COMPLETED": "",
		"TYPE": 0,
		"TRASH_BIN": "",
		"IMPORTANCE": 0,
		"METAINF": "",
		"FLOATING": 0,
		"HIDE": 0,
		"HIDE_UNTIL": 0
  }

  
  updateUI() {
    this.ui = (new Task({...this.constructor.DATA})).render().addClass('new');
  }
  

}

/** ------------------------------------------------------------ */
/** src/__widgets/dump/dump.js */
/** ------------------------------------------------------------ */
class Dump extends DOMElement{
  updateUI() {
    this.ui.content = new E('textarea').set({ value : JSON.stringify(Loader.data, null, '\t') });
    this.ui.append(this.ui.content);
  }

}

/** ------------------------------------------------------------ */
/** src/__widgets/filter/filter.js */
/** ------------------------------------------------------------ */
class Filter extends DOMElement {
  filter;
  event;

  constructor(event) {
    super();

    this.filter = {
      goal    : Select.OPTION_ANY__VALUE,
      project : Select.OPTION_ANY__VALUE,
      context : Select.OPTION_ANY__VALUE
    }

    this.event = event;

    this.ui.addClass('filter');
    this.ui.goal = new Field('Цель', new Select(true, true).addEventListener('change', (e) => {
      this.filter.goal = +e.target.value;
      this.change();
    }));
    this.ui.project = new Field('Проект', new Select(true, true).addEventListener('change', (e) => {
      this.filter.project = +e.target.value;
      this.change();
    }));
    this.ui.context = new Field('Контекст', new Select(true, true).addEventListener('change', (e) => {
      this.filter.context = +e.target.value;
      this.change();
    }));

    this.ui.append(this.ui.goal, this.ui.project, this.ui.context);
  }

  change() {
    const ev = new CustomEvent(this.event, { bubbles: true });
    this.ui.dispatchEvent(ev);
  }

  updateUI() {
    /*
    this.ui.goal.field.setOptions(Goal.selectOptions, this.filter.goal);
    this.ui.project.field.setOptions(Project.selectOptions, this.filter.project);
    this.ui.context.field.setOptions(Context.selectOptions, this.filter.context);
    */
  }
}

/** ------------------------------------------------------------ */
/** src/__widgets/goals/goals.js */
/** ------------------------------------------------------------ */
class Goals extends DOMElement{
  updateUI() {
    Goal.poolHrc.forEach(goal => {
      this.ui.append(this.renderGoal(goal));
    });
  }

  renderGoal(goal) {
    const result = goal.render();
    goal.dataExt.children.forEach(child => {
      result.append(this.renderGoal(child));
    });
    return result;
  }

}

/** ------------------------------------------------------------ */
/** src/__widgets/kanban/kanban.js */
/** ------------------------------------------------------------ */
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

/** ------------------------------------------------------------ */
/** src/__widgets/projects/projects.js */
/** ------------------------------------------------------------ */
class Projects extends DOMElement{
  updateUI() {
    Project.poolHrc.forEach(project => {
      this.ui.append(this.renderProject(project));
    });
  }

  renderProject(project) {
    const result = project.render();
    project.dataExt.children.forEach(child => {
      result.append(this.renderProject(child));
    });
    return result;
  }

}

/** ------------------------------------------------------------ */
/** src/__app/loader.js */
/** ------------------------------------------------------------ */
class Loader {

  static data;

  static delete(element, id) {
    console.log(element);
    console.log(id);
    console.log(this.data[element]);
    const index = this.data[element].findIndex(item => item.ID === id);
    if (index !== -1) this.data[element].splice(index, 1);
  }

  constructor() {
    const msg = document.createElement('p');
    msg.textContent = 'Выбрать дамп:'
    document.body.appendChild(msg);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      this.parseJsonFile(file).then((data) => {
        this.constructor.data = data;
        Goal.set(data.GOAL);
        Folder.set(data.FOLDER);
        Context.set(data.CONTEXT);
        Priority.set(Priority.PRIORITIES);
        Project.set(data.TASK.filter(task => (task.TYPE == Project.TYPE)));
        ChecklistItem.set(data.TASK.filter(task => (task.TYPE == ChecklistItem.TYPE)));
        Checklist.set(data.TASK.filter(task => (task.TYPE == Checklist.TYPE)));
        Task.set(data.TASK.filter(task => (task.TYPE == Task.TYPE)));

        new UI();
      });
    });
    document.body.appendChild(input);
  }

  parseJsonFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonObject = JSON.parse(event.target.result);
          resolve(jsonObject); // Возвращаем готовый объект
        } catch (error) {
          reject(new Error('Неверный формат JSON-файла'));
        }
      };

      reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
      reader.readAsText(file);
    });
  }

}

/** ------------------------------------------------------------ */
/** src/__app/test-loader.js */
/** ------------------------------------------------------------ */
class TestLoader {

  constructor() {
    const body = new E(document.body);
    body.append('header', new E().set({ textContent : 'body.header: создан' }));
    console.log(body);
    body.header.set({ textContent : 'body.header: обновлён' });
    console.log(body);
    body.append('content', new E().set({ textContent : 'body.content' }));
    console.log(body);
    body.content.append('content', new E('p').set({ textContent : 'body.content.content' }));
    console.log(body);
    body.content.remove();
    console.log(body);
    body.append('content', body.content);
    console.log(body);
  }

}

/** ------------------------------------------------------------ */
/** src/__app/ui.js */
/** ------------------------------------------------------------ */
class UI {
  static MAIN_MENU__EVENT             = 'MAIN_MENU_CLICK';

  static MAIN_MENU__SIGNAL__ADD_TASK  = 'ADD_TASK';
  static MAIN_MENU__SIGNAL__KANBAN    = 'KANBAN';
  static MAIN_MENU__SIGNAL__GOALS     = 'GOALS';
  static MAIN_MENU__SIGNAL__PROJECTS  = 'PROJECTS';
  static MAIN_MENU__SIGNAL__DUMP      = 'DUMP';
  
  body;
  menu;
  content;

  constructor() {
    this.body = new E(document.body);
    this.body.clear();
    
    this.menu = new Menu(UI.MAIN_MENU__EVENT, [
      {text: '+'      , signal: UI.MAIN_MENU__SIGNAL__ADD_TASK, repeat: true },
      {text: 'Канбан' , signal: UI.MAIN_MENU__SIGNAL__KANBAN   },
      {text: 'Цели'   , signal: UI.MAIN_MENU__SIGNAL__GOALS    },
      {text: 'Проекты', signal: UI.MAIN_MENU__SIGNAL__PROJECTS },
      {text: 'Дамп'   , signal: UI.MAIN_MENU__SIGNAL__DUMP     }
    ], UI.MAIN_MENU__SIGNAL__KANBAN);
    this.content = new Kanban();
    
    this.body.append(this.menu.ui, this.content.render());

    this.body.addEventListener(UI.MAIN_MENU__EVENT, (event) => {
      this.mainMenuClick(event);
    });

    this.body.addEventListener(Item.EVENT__SAVE, (e) => {
      this.setContent(this.content);
    });

  }

  mainMenuClick(event) {
      switch(event.detail.signal) {
        case UI.MAIN_MENU__SIGNAL__ADD_TASK:
          if (!this.isAddTask) {
            this.body.append(new AddTask().render());
          }
          break;
        case UI.MAIN_MENU__SIGNAL__KANBAN:
          this.setContent(new Kanban());
          break;
        case UI.MAIN_MENU__SIGNAL__GOALS:
          this.setContent(new Goals());
          break;
        case UI.MAIN_MENU__SIGNAL__PROJECTS:
          this.setContent(new Projects());
          break;
        case UI.MAIN_MENU__SIGNAL__DUMP:
          this.setContent(new Dump());
          break;
      }
  }

  setContent(element) {
    this.content.remove();
    this.content = element;
    const contentUI = this.content.render();
    this.body.append(contentUI);
  }

}

