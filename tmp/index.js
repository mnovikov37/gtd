/** ------------------------------------------------------------ */
/** src/shared/lib/common.js */
/** ------------------------------------------------------------ */
/**
 * Функционал, общий для всего кода проекта
 */

// Получение вложенного свойства объекта по его текстовому представлению: 'role.permissions.group.id'
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Фильтрует объект типа Map по нескольким условиям
 * Возвращает новый Map. Исходный Map не меняет
 * conditions: [
 *   { p : param1, v: value 1 },
 *   { p : param2, v: [value 2_1, value 2_2] },
 *   ...
 * ]
 * Если v - массив, то фильтрация параметра по условию "ИЛИ"
 * Разные параметры между собой фильтруюутся по условию "И"
 * Если надо фильтровать между собой разные параметры по условию "ИЛИ" - можно фильтровать отдельно и потом объединять результаты
 */
function filterMap(map, conditions) {
  let result = new Map(map);
  conditions.forEach(condition => {
    if (Array.isArray(condition.v)) {
      resCommon = new Map();
      condition.v.forEach(value => {
        res = new Map([...result].filter(([key, item]) => getNestedValue(item, condition.p) === value));
        res.forEach((value, key) => resCommon.set(key, value));
      });
      result = resCommon;
    } else {
      result = new Map([...result].filter(([key, item]) => getNestedValue(item, condition.p) === condition.v));
    }
  });
  return result;
}

/**
 * Возвращает настоящий момент времени в местном часовом поясе в формате "2024-12-09 18:49:21.798"
 */
function nowWithMs() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');  // Месяцы в JS идут от 0 до 11, поэтому добавляем 1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');  // Миллисекунды дополняем до 3 знаков

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/** ------------------------------------------------------------ */
/** src/shared/ui/dom-element.js */
/** ------------------------------------------------------------ */
/**
 * Какой-то элемент пользовательского интерфейса. По умолчанию блок
 */
class DOMElement {
  ui;

  constructor() {
    this.ui = new E('div'); // "Каркас" пользовательского интерфейса - неизменяемая часть
  }

  updateUI() { // Здесь то, что должно обновляться в UI: либо при каждой отрисовке, либо по команде извне
    this.ui.set({ textContent : "[DOMElement]" });
  }

  render() {
    this.updateUI();
    return this.ui;
  }

  remove() {
    this.ui.remove();
  }

  // Диагностическая функция
  dump() {
    console.log( this.ui.e.outerHTML);
  }
}

/** ------------------------------------------------------------ */
/** src/shared/ui/e.js */
/** ------------------------------------------------------------ */
class E {

  e;

  constructor(element) {
    if (element instanceof HTMLElement) {
      this.e = element;
    } else {
      this.e = document.createElement(element);
    }
  }

  get(property = 'e') {
    let result = null;
    if (property == 'e') {
      result = this.e;
    } else {
      result = this.e[property];
    }
    return result;
  }

  value() {
    return this.get('value');
  }

  checkValidity() {
    return this.e.checkValidity();
  }

  reportValidity() {
    return this.rv(this.e);
  }

  // reportValidity рекурсивно по всем вложенным элементам
  rv(element) {
    
    let result = true;
    if (element.localName === 'input' || element.localName === 'select' || element.localName === 'textarea') {
      result = element.reportValidity();
    } else {
      for (const child of element.children) {
        result = this.rv(child);
        if (!result) break;
      }
    }
    return result;
  }

  clear() {
    this.e.innerHTML = '';
  }

  addClass(...classes) {
    this.e.classList.add(...classes);
    return this;
  }

  removeClass(...classes) {
    this.e.classList.remove(...classes);
    return this;
  }

  replaceChildren(...nodes) {
    this.e.replaceChildren(...nodes);
    return this;
  }

  set(properties) {
    for (let property in properties) {
      this.e[property] = properties[property];
    }
    return this;
  }

  setCustomValidity(v) {
    this.e.setCustomValidity(v);
  }

  addEventListener(types, callback) {
    if (Array.isArray(types)) {
      types.forEach(type => this.e.addEventListener(type, callback));
    } else {
      this.e.addEventListener(types, callback);
    }
    return this;
  }

  dispatchEvent(ev) {
    this.e.dispatchEvent(ev);
  }

  append(...elements) {
    elements.forEach(e => {
      if (e instanceof E) {
        this.e.append(e.get());
      } else {
        this.e.append(e);
      }
    });
    return this;
  }

  prepend(...elements) {
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i] instanceof E) {
        this.e.prepend(elements[i].get());
      } else {
        this.e.prepend(elements[i]);
      }
    }
    return this;
  }

  remove() {
    this.e.remove();
    return this;
  }

}

/** ------------------------------------------------------------ */
/** src/shared/ui/field.js */
/** ------------------------------------------------------------ */
class Field extends E {

  title;
  field;

  constructor(title, field = null) {
    super('div');

    this.addClass('field');
    this.title = new E('p').set({ textContent : `${title} :` });
    this.field = field ? field : new E('p').set({ textContent : '[ null ]' });
    this.append(this.title, this.field);
  }

  setTitle(title) {
    this.title.set({ textContent : `${title} :` });
    return this;
  }

  setCustomValidity(v) {
    this.field.setCustomValidity(v);
  }

  reportValidity() {
    return this.field.reportValidity();
  }

  value() {
    return this.field instanceof E ? this.field.get('value') : this.field.value;
  }

  setField(field) {
    this.field.remove();
    this.field = field;
    this.append(this.field);
    return this;
  }

}

/** ------------------------------------------------------------ */
/** src/shared/ui/menu.js */
/** ------------------------------------------------------------ */
class Menu {

  current = '';
  ui;

  constructor(event, items, current = '') {
    this.ui = new E('div');

    this.current = current;

    items.forEach(item => {
      this.ui.append(new E('button').set({ textContent : item.text }).addEventListener('click', (e) => {
        if (this.current !== item.signal || item.repeat) {
          this.current = item.signal;
          const ev = new CustomEvent(event, {
            bubbles: true,
            detail: { signal: item.signal }
          });
          this.ui.dispatchEvent(ev);
        }
      }));
    });

  }

}

/** ------------------------------------------------------------ */
/** src/shared/ui/select.js */
/** ------------------------------------------------------------ */
class Select extends E {
  /**
   * Структура опций:
   *  [
   *    { title: title1, value: value1 },
   *    { title: title2, value: value2, children: [
   *      { title: title2_1, value: value2_1 },
   *      ...
   *    ] },
   *    ...
   *  ]
   * 
   * Вложенность опций неограничена
   * Опция "Любой" - значение = ''
   * Опция "Никакой" - значение = 0
   */

  static PREFIX = '\u00A0\u00A0';
  static OPTION_ANY__TITLE = '- ЛЮБОЙ -';
  static OPTION_ANY__VALUE = -1;
  static OPTION_NO__TITLE = '- НЕТ -';
  static OPTION_NO__VALUE = 0;

  optionAny;
  optionNo;

  constructor(optionNo = false, optionAny = false) {
    super('select');

    this.optionNo = optionNo;
    this.optionAny = optionAny;
  }

  addOptions(options, prefix = '') {
    options.forEach(item => {
      this.append(new E('option').set({ textContent : `${prefix}${item.title}`, value : item.value }));
      if (Object.hasOwn(item, 'children')) {
        this.addOptions(item.children, `${prefix}${Select.PREFIX}`);
      }
    });
    return this;
  }

  setOptions(options, value = null) {
    this.replaceChildren();
    if (this.optionNo ) this.append(new E('option').set({ textContent :  Select.OPTION_NO__TITLE, value :  Select.OPTION_NO__VALUE }));
    if (this.optionAny) this.append(new E('option').set({ textContent : Select.OPTION_ANY__TITLE, value : Select.OPTION_ANY__VALUE }));
    this.addOptions(options);
    if (value) this.set({ value : value });
    return this;
  }

  setNoAny(optionNo = false, optionAny = false) {
    this.optionNo = optionNo;
    this.optionAny = optionAny;
    return this;
  }
}

/** ------------------------------------------------------------ */
/** src/entities/base/item.js */
/** ------------------------------------------------------------ */
/**
 * Элемент пользовательского интерфейса + данные и логика работы над ними
 */
class Item extends DOMElement {
  static ITEM_TYPE = 'ITEM';
  static EVENT__SAVE = 'ITEM__SAVE';
  static poolFlat = new Map();  // Все объекты данного класса - подобие таблицы в БД
  static maxId;                 // Счётчик ID для создания новых объектов

  data;     // Данные из дампа. Пойдут обратно в дамп
  dataExt;  // Дополнительные данные. Используются только в работе приложения, в дамп не идут

  // Создание пула объектов из дампа
  static set(source) {
    this.maxId = 0;
    this.poolFlat = new Map();
    source.forEach((data) => {
      this.poolFlat.set(data.ID, new this(data));
      if (data.ID > this.maxId) this.maxId = data.ID;
    }); 
  }

  static get(id) { return this.poolFlat.get(id) } // Получить объект из пула по его ID

  // Добавить новый объект в пул
  static add(item) {
    if (item.constructor === this) {
      if (!item.data.ID) {
        this.maxId = this.maxId + 1;
        item.data.ID = this.maxId;
        item.data.CREATED = nowWithMs();
        item.data.MODIFIED = item.data.CREATED;
        Loader.data[this.ITEM_TYPE].push(item.data);
      }
      this.poolFlat.set(item.data.ID, item);
    } else {
      throw new Error(`Попытка добавить ${item.constructor.name} в пул ${this.name}`);
    }
  }

  static delete(id) {
    this.poolFlat.delete(id);
  }

  // conditions = [ { p : property1, v : value1 }, { p : property2, v : value2 } ]
  static filter(conditions) { return filterMap(this.poolFlat, conditions) }

  constructor(data) {
    super();
    // -- данные --
    this.data = data;
    this.dataExt = { children : new Map() };
    // -- дополнение пользовательского интерфейса --
    this.ui.addClass('item');
      this.ui.header = new E('div').addClass('item__header');                                                 // -- головная часть
        this.ui.header.title = new E('textarea').addClass('item__title').set({ required : true });            // ---- название
        this.ui.header.save = new E('button').addClass('item__save').set({ textContent : '🖫' })              // ---- кнопка "Сохранить"
          .addEventListener('click', () => { this.save(); });
        this.ui.header.remove = new E('button').addClass('item__remove').set({ textContent : '⦸' })           // ---- кнопка "Удалить"
          .addEventListener('click', () => { this.remove(); });
        this.ui.header.details = new E('button').addClass('item__details-button').set({ textContent : '◀' })  // ---- кнопка "Раскрыть / закрыть детали"
          .addEventListener('click', () => { this.detailsExpandCollapse() });
        this.ui.header.append(this.ui.header.title, this.ui.header.save, this.ui.header.remove, this.ui.header.details);
      this.ui.details = new E('div').set({ hidden : true });                                                  // -- детали
      this.ui.append(this.ui.header, this.ui.details);
  }

  updateUI() { // Здесь то, что должно обновляться в UI при каждой перерисовке
    this.ui.header.title.set({ value : this.data.TITLE });
  }

  detailsExpandCollapse() {
    if (this.ui.details.get('hidden')) {
      this.detailsExpand();
    } else {
      this.detailsCollapse();
    }
  }

  detailsExpand() {
    this.ui.details.set({ hidden : false });
    this.ui.header.details.set({ textContent : '▼' });
  }

  detailsCollapse() {
    this.ui.details.set({ hidden : true });
    this.ui.header.details.set({ textContent : '◀' });
  }

  // Условия для валидации полей перед сохранением. Должны назначаться непосредственно перед сохранением (заранее не работает)
  validate() {
    this.ui.header.title.setCustomValidity(
      this.ui.header.title.value().length > 0 && this.ui.header.title.value().trim() === "" ? "Название должно состоять не только из пробелов" : ""
    );
  }

  mappingData() {
    this.data.TITLE = this.ui.header.title.value().trim();
    this.data.MODIFIED = nowWithMs();
  }

  save() {
    this.validate();
    if (this.ui.reportValidity()) {
      this.ui.removeClass('new');
      this.mappingData();

      if (!this.data.ID) {
        this.constructor.add(this);
      }

      const ev = new CustomEvent(this.constructor.EVENT__SAVE, { bubbles: true });
      this.ui.dispatchEvent(ev);
    }
  }

  remove() {
    if (this.data.ID) {
      if (confirm(`Точно удалить "${this.data.TITLE}"?`)) {
        this.constructor.delete(this.data.ID);
        Loader.delete(this.constructor.ITEM_TYPE, this.data.ID);
        const ev = new CustomEvent(this.constructor.EVENT__SAVE, { bubbles: true });
        this.ui.dispatchEvent(ev);
      }
    } else {
      this.ui.remove();
    }
  }

}

/** ------------------------------------------------------------ */
/** src/entities/base/task-attribute.js */
/** ------------------------------------------------------------ */
/**
 * Фильтрует задачи и чеклисты
 * Имеет иерархию
 * Может быть представлен в виде списка опций для селекта
 */
class TaskAttribute extends Item {
  static ITEM_TYPE = 'TASK_ATTRIBUTE';
  static attribute = 'TaskAttribute'; // Название поля задачи, которое соответствует атрибуту
  static poolHrc = new Map();         // Пул всех объектов данного класса, но с иерархической структурой - учитывает, кто кому родитель
  static selectOptions = [];          // Опции для создания селектов на базе атрибута

  condition;

  static set(source) {
    super.set(source);

    this.poolHrc = new Map();

    this.poolFlat.forEach((item) => {
      if (item.data.PARENT !== 0 && this.poolFlat.has(item.data.PARENT)) {
        this.poolFlat.get(item.data.PARENT).dataExt.children.set(item.data.ID, item);
      } else {
        this.poolHrc.set(item.data.ID, item);
      }
    });

    this.selectOptions = this.makeSelectOptions();
  }

  static makeSelectOptionForId(id = 0) {
    const item = this.get(id);
    return this.makeSelectOption(item);
  }

  static makeSelectOption(item = null) {
    let result = null;
    if (item != null) {
      const option = { title : item.data.TITLE, value : item.data.ID };
      if (item.dataExt.children.size > 0) {
        option.children = [];
        [...item.dataExt.children.values()].sort((a, b) => { return a.data.TITLE.localeCompare(b.data.TITLE) }).forEach(c => {
          option.children.push(this.makeSelectOption(c));
        });
      }
      result = option;
    }
    return result;
  }

  static makeSelectOptions() {
    const result = [];
    this.poolHrc.forEach(item => {
      const option = this.makeSelectOption(item);
      if (option != null) result.push(option);
    });
    return result;
  }

  // Условие для фильтрации на базе объекта и, если требуется - всех его потомков
  static filterCondition(value, hrc = false) {
    let val;
    if (hrc) {
      val = this.getIdsHrc(value);
    } else {
      val = value;
    }
    return { p: this.attribute, v: val };
  }

  // Получить id объекта и всех его потомков в виде одномерного массива
  static getIdsHrc(id) {
    const result = [];
    result.push(id);
    const children = this.get(id)?.dataExt.children;
    if (children) {
      const sorted = [...children.values()].sort((a, b) => { return a.data.TITLE.localeCompare(b.data.TITLE) });
      sorted.forEach(s => { result.push(...this.getIdsHrc(s.data.ID)) });
    }
    return result;
  }

  constructor(data) {
    super(data);
    this.condition = { p: this.constructor.attribute, v: this.data.ID };
  }

}

/** ------------------------------------------------------------ */
/** src/entities/base/task-template.js */
/** ------------------------------------------------------------ */
/**
 * Абстрактный предок всех типов задач
 */
class TaskTemplate extends Item {
  static ITEM_TYPE = 'TASK';

  constructor(data) {
    super(data);
    // -- дополнение пользовательского интерфейса --
    this.ui.header.check = new E('div').addClass('task__check');                                      // -- головная часть : отметка о выполнении
      this.ui.header.check.completed = new E('input').set({ type : 'checkbox' })
        .addEventListener('change', (e) => {
          this.save();
        });
      this.ui.header.check.append(this.ui.header.check.completed);
    this.ui.header.iconNote = new E('div').addClass('task__note-icon').set({ textContent : '📝' }); // -- головная часть : иконка заметки
    this.ui.header.note = new E('textarea').addClass('task__note')                                  // -- головная часть : заметка
      .addEventListener('focus', () => { this.noteExpand() })
      .addEventListener('blur', () => { this.noteCollapse() });
    this.ui.header.append(this.ui.header.check, this.ui.header.iconNote, this.ui.header.note);
      
    this.ui.details.parent = new Field('Родитель').setField(new Select(true));                      // -- детали : родитель
    this.ui.details.append(this.ui.details.parent);

    this.noteCollapse();
  }

  completed() { return this.data.COMPLETED !== ""; }

  updateUI() {
    super.updateUI();
    this.ui.header.check.completed.set({ checked : this.completed() });
    if (this.completed()) {
      this.ui.header.title.addClass('item__header_checked');
    } else {
      this.ui.header.title.removeClass('item__header_checked');
    }
    this.ui.header.note.set({ value : this.data.NOTE});
  }

  mappingData() {
    super.mappingData();
    const checked = this.ui.header.check.completed.get('checked');
    if (checked) {
      if (!this.completed()) this.data.COMPLETED = nowWithMs();
    } else {
      this.data.COMPLETED = "";
    }
    this.dataExt.completed = checked;
    this.data.NOTE = this.ui.header.note.value().trim();
    this.data.PARENT = +this.ui.details.parent.value();
  }

  noteExpand() {
    this.ui.header.note.e.style.height = 'auto';
    this.ui.header.note.e.style.height = (this.ui.header.note.get('scrollHeight')) + 'px';
  }

  noteCollapse() {
    if (this.ui.details.get('hidden')) {
      if ( this.ui.header.note.get('value').trim() === '' ) {
        this.ui.header.note.set({ hidden : true });
        this.ui.header.iconNote.e.style.display = 'none';
      } else {
        this.ui.header.note.e.style.height = 'auto';
        this.ui.header.note.set({ rows : '1' });
      }
    }
  }

  detailsExpand() {
    super.detailsExpand();
    this.ui.header.note.set({ hidden : false });
    this.ui.header.iconNote.e.style.display = 'flex';
    this.noteExpand();
  }

  detailsCollapse() {
    super.detailsCollapse();
    this.noteCollapse();
  }

}

/** ------------------------------------------------------------ */
/** src/entities/context/context.js */
/** ------------------------------------------------------------ */
class Context extends TaskAttribute {
  static ITEM_TYPE = 'CONTEXT';
  static attribute = 'data.CONTEXT';

  updateUI() {
    this.ui.set({ textContent : `Контекст [${this.data.TITLE}]` });
  }
}

/** ------------------------------------------------------------ */
/** src/entities/folder/folder.js */
/** ------------------------------------------------------------ */
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

/** ------------------------------------------------------------ */
/** src/entities/goal/goal.js */
/** ------------------------------------------------------------ */
class Goal extends TaskAttribute {
  static ITEM_TYPE = 'GOAL';
  static attribute = 'data.GOAL';
}

/** ------------------------------------------------------------ */
/** src/entities/priority/priority.js */
/** ------------------------------------------------------------ */
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

/** ------------------------------------------------------------ */
/** src/entities/project/project.js */
/** ------------------------------------------------------------ */
class Project extends TaskAttribute {
  static ITEM_TYPE = 'TASK';
  static attribute = 'data.PARENT';
  static TYPE = 1;

}

/** ------------------------------------------------------------ */
/** src/entities/task/task.js */
/** ------------------------------------------------------------ */
class Task extends TaskTemplate {
  static TYPE = 0;

  constructor(data)  {
    super(data);
    // -- дополнение пользовательского интерфейса
    this.ui.details.type    = new Field('Тип',             new Select().addOptions([ { title : 'Задача', value : Task.TYPE }, { title : 'Чеклист', value : Checklist.TYPE } ]));
    this.ui.details.dueDate = new Field('Дата завершения', new E('input').set({ type  : 'date' }));
    this.ui.details.goal    = new Field('Цель',            new Select(true));
    this.ui.details.prepend(this.ui.details.type, this.ui.details.dueDate, this.ui.details.goal);

    this.ui.details.parent.setTitle('Проект');

    this.ui.details.folder   = new Field('Папка',     new Select(true));
    this.ui.details.context  = new Field('Контекст',  new Select(true));
    this.ui.details.priority = new Field('Приоритет', new Select().setOptions(Priority.selectOptions));
    this.ui.details.append(this.ui.details.folder, this.ui.details.context, this.ui.details.priority);
  }

  dueDate() { return this.data.DUE_DATE.slice(0, 10); }

  updateUI() {
    super.updateUI();
    this.ui.details.type.field.set({ value : this.constructor.TYPE });
    this.ui.details.dueDate.field.set({ value : this.dueDate() });
    this.ui.details.goal.field.setOptions(Goal.selectOptions, this.data.GOAL);
    this.ui.details.parent.field.setOptions(Project.selectOptions, this.data.PARENT);
    this.ui.details.folder.field.setOptions(Folder.selectOptions, this.data.FOLDER);
    this.ui.details.context.field.setOptions(Context.selectOptions, this.data.CONTEXT);
    this.ui.details.priority.field.set({ value: this.data.PRIORITY });
  }

  validate() {
    super.validate();
  }

  mappingData() {
    super.mappingData();
    if (+this.ui.details.type.value() == Checklist.TYPE) this.changeToChecklist();
    this.data.DUE_DATE = this.ui.details.dueDate.value();
    if (this.data.DUE_DATE !== "" ) this.data.DUE_DATE += " 00:00";
    this.data.GOAL     = +this.ui.details.goal.value();
    this.data.PARENT   = +this.ui.details.parent.value();
    this.data.FOLDER   = +this.ui.details.folder.value();
    this.data.CONTEXT  = +this.ui.details.context.value();
    this.data.PRIORITY = +this.ui.details.priority.value();
  }

  changeToChecklist() {
    this.constructor.delete(this.data.ID);
    Checklist.add(this.data);
  }

}

/** ------------------------------------------------------------ */
/** src/entities/task/checklist.js */
/** ------------------------------------------------------------ */
/**
 * Может быть представлен в виде опций для селекта
 */
class Checklist extends Task {
  static TYPE = 2;
  static selectOptions = [];

  empty; // Признак пустого чеклиста

  static set(source) {
    super.set(source);
    this.selectOptions = this.setSelectOptions(this.poolFlat);
  }

  static add(item) {
    super.add(item);
    this.selectOptions = this.setSelectOptions(this.poolFlat);
  }

  constructor(data) {
    super(data);
  }

  static setSelectOptions(items) {
    const result = [];
    const sortedPool = [...items.values()].sort((a, b) => {
      return a.completed() - b.completed() ||
      a.dueDate().localeCompare(b.dueDate()) ||
      a.data.TITLE.localeCompare(b.data.TITLE);
    });
    //console.log(sortedPool);
    sortedPool.forEach((item) => {
      const option = { title : `[${item.completed() ? "V" : " "}] (${item.dueDate()}) ${item.data.TITLE}`, value : item.data.ID };
      result.push(option);
    });
    return result;
  }

  updateUI() {
    super.updateUI();
    this.empty = true;
    ChecklistItem.poolFlat.forEach(item => {
      if (item.data.PARENT == this.data.ID) {
        if (this.empty) this.empty = false; // Если нашли хоть один пункт - значит, чеклист не пустой
        this.ui.details.append(item.render());
      }
    });
  }

  validate() {
    super.validate();
    this.ui.details.type.setCustomValidity(+this.ui.details.type.value() == Task.TYPE && !this.empty ? "Преобразовать в задачу можно только пустой чеклист" : "");
  }

  mappingData() {
    super.mappingData();
    if (+this.ui.details.type.value() == Task.TYPE) this.changeToTask();
  }

  changeToTask() {
    this.constructor.delete(this.data.ID);
    Task.add(this.data);
  }

}

/** ------------------------------------------------------------ */
/** src/entities/task/checklist-item.js */
/** ------------------------------------------------------------ */
class ChecklistItem extends TaskTemplate {
  static TYPE = 3;

  constructor(data) {
    super(data);
    // -- дополнение пользовательского интерфейса
    this.ui.header.check.addClass('task__check_type_list-item');
    this.ui.details.parent.setTitle('Чеклист')
  }

  updateUI() {
    super.updateUI()
    this.ui.details.parent.field.setOptions(Checklist.selectOptions, this.data.PARENT);
  }

}

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
    this.ui.goal.field.setOptions(Goal.selectOptions, this.filter.goal);
    this.ui.project.field.setOptions(Project.selectOptions, this.filter.project);
    this.ui.context.field.setOptions(Context.selectOptions, this.filter.context);
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
      result.append(task.render());
    });

    return result;
  }

  renderFolders(tasks) {
    const result = new E('div').addClass('kanban__folders');
    this.constructor.FOLDERS.forEach(folder => {
      result.append(this.renderFolder(filterMap(tasks, [Folder.filterCondition(folder.ID)])));
    });
    return result;
  }

  renderFoldersFromAttributes(tasks, attrs) {
    const conditions = [];
    if (attrs.goal) { conditions.push(Goal.filterCondition(attrs.goal)); }
    if (attrs.project) { conditions.push(Project.filterCondition(attrs.project)); }
    if (attrs.context) { conditions.push(Context.filterCondition(attrs.context)); }
    const result = this.renderFolders(filterMap(tasks, conditions));
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

