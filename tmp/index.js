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

/**
 * Универсальный метод для создания цепочек вызовов на любых HTML-элементах.
 * @param {Function|string} fn - Функция или имя метода самого элемента (например, 'append' или 'setAttribute')
 * @param {...*} args - Любые аргументы, которые нужно передать в функцию
 * @returns {HTMLElement} - Возвращает сам элемент (this)
 */
HTMLElement.prototype.chain = function(fn, ...args) {
  if (typeof fn === 'string') {
    // Если передано имя нативного метода (например, 'append')
    this[fn](...args);
  } else if (typeof fn === 'function') {
    // Если передана посторонняя функция, выполняем её в контексте этого элемента
    fn.call(this, ...args);
  }
  return this;
};

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
  #e;                   // Настоящий DOM-элемент
  #visible = true;      // Флаг видимости
  #childComponents = []; // Безопасное хранилище для дочерних компонентов E

  constructor(element = 'div') {
    if (element instanceof HTMLElement) {
      this.#e = element;
    } else {
      this.#e = document.createElement(element);
    }
  }

  // Безопасный геттер для получения DOM-узла наружу, если необходимо
  get(property = 'e') {
    return property === 'e' ? this.#e : this.#e[property];
  }

  value() {
    return this.get('value');
  }

  checkValidity() {
    return this.#e.checkValidity();
  }

  reportValidity() {
    return this._rv(this.#e);
  }

  // Внутренний метод валидации (protected синтаксис через нижнее подчеркивание)
  _rv(element) {
    let result = true;
    if (element.localName === 'input' || element.localName === 'select' || element.localName === 'textarea') {
      result = element.reportValidity();
    } else {
      for (const child of element.children) {
        result = this._rv(child);
        if (!result) break;
      }
    }
    return result;
  }

  clear() {
    this.#e.innerHTML = '';
    this.#childComponents = []; // Очищаем и ссылки на компоненты
  }

  addClass(...classes) {
    this.#e.classList.add(...classes);
    return this;
  }

  removeClass(...classes) {
    this.#e.classList.remove(...classes);
    return this;
  }

  replaceChildren(...nodes) {
    // Преобразуем элементы E в нативные узлы перед передачей
    const nativeNodes = nodes.map(n => n instanceof E ? n.get() : n);
    this.#e.replaceChildren(...nativeNodes);
    
    // Обновляем список дочерних компонентов
    this.#childComponents = nodes.filter(n => n instanceof E);
    return this;
  }

  set(properties) {
    for (let property in properties) {
      if (Object.hasOwn(properties, property)) {
        this.#e[property] = properties[property];
      }
    }
    return this;
  }

  setCustomValidity(v) {
    this.#e.setCustomValidity(v);
  }

  addEventListener(types, callback) {
    if (Array.isArray(types)) {
      types.forEach(type => this.#e.addEventListener(type, callback));
    } else {
      this.#e.addEventListener(types, callback);
    }
    return this;
  }

  dispatchEvent(ev) {
    this.#e.dispatchEvent(ev);
  }

  // Изменено на публичный метод управления видимостью, чтобы избежать ошибок TypeError в наследниках
  setVisible(v) {
    this.#visible = v;
    if (!v) {
      this.#e.style.display = 'none'; // Интегрируем скрытие на уровне DOM
    } else {
      this.#e.style.removeProperty('display');
    }
    // Безопасно передаем статус видимости вглубь по изолированному массиву
    this.#childComponents.forEach(child => child.setVisible(v));
  }

  // Внутренний метод аппенда с регистрацией
  _appendPrepend(title, element, prepend = false) {
    let el;
    if (element instanceof E) {
      el = element;
    } else if (element instanceof HTMLElement) {
      el = new E(element);
    } else {
      throw new TypeError('Can append only E or HTMLElement');
    }

    el.setVisible(this.#visible);
    
    // Регистрируем как свойство текущего объекта для быстрого доступа по имени
    this[title] = el;
    // Сохраняем в изолированный массив для системных обходов (render, visibility)
    this.#childComponents.push(el);

    if (prepend) {
      this.#e.prepend(el.get());
    } else {
      this.#e.append(el.get());
    }
  }

  append(element) {
    this._appendPrepend('x', element);
    return this;
  }

  prepend(element) {
    this._appendPrepend('x', element, true);
    return this;
  }

  hide() {
    this.#visible = false;
    this.e.remove();
    return this;
  }

  // Метод, который наследники МОГУТ переопределять для обновления своих данных
  updateUI() {}

  render() {
    this.updateUI(); // Вызываем кастомное обновление компонента
    
    // Безопасно запускаем рендер дочерних элементов
    this.#childComponents.forEach(child => {
      child.render();
    });
    return this;
  }

  remove() {
    this.setVisible(false);
    this.#e.remove();
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
    /*
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
    */
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
/** src/entities/base/item.model.js */
/** ------------------------------------------------------------ */
class Item {
  static ITEM_TYPE = 'ITEM';
  static poolFlat = new Map(); // Хранилище объектов (аналог таблицы БД)
  static maxId = 0;

  data;    // Данные из дампа, которые пойдут обратно в дамп
  dataExt; // Дополнительные рантайм-данные приложения. В дамп не идут

  // Заполнение пула объектов из исходного дампа
  static set(source) {
    this.maxId = 0;
    this.poolFlat = new Map();
    source.forEach((data) => {
      this.poolFlat.set(data.ID, new this(data));
      if (data.ID > this.maxId) this.maxId = data.ID;
    });
  }

  // Получить объект из пула по ID
  static get(id) {
    return this.poolFlat.get(id); 
  }

  // Добавить новый объект в пул
  static add(item) {
    if (item.constructor === this) {
      if (!item.data.ID) {
        this.maxId = this.maxId + 1;
        item.data.ID = this.maxId;
        item.data.CREATED = nowWithMs();
        item.data.MODIFIED = item.data.CREATED;
        Loader.data[this.ITEM_TYPE].push(item.data); // Включить новый объект в дамп
      }
      this.poolFlat.set(item.data.ID, item);
    } else {
      throw new TypeError(`Попытка добавить ${item.constructor.name} в пул ${this.name}`);
    }
  }

  // Удалить объект из пула по ID
  static delete(id) {
    this.poolFlat.delete(id);
  }

  static filter(conditions) { 
    return filterMap(this.poolFlat, conditions);
  }

  constructor(data) {
    this.data = data;
    this.dataExt = { children: new Map() };
  }

}

/** ------------------------------------------------------------ */
/** src/entities/base/item.view.js */
/** ------------------------------------------------------------ */
class ItemView extends HTMLElement {
  model; // Ссылка на связанную модель данных
  
  // Внутренние ссылки на DOM-элементы карточки
  #titleElement;
  #detailsElement;
  #expandButton;

  constructor(model) {
    super();
    this.model = model;

    // Настраиваем базовый контейнер карточки
    this.chain('setAttribute', 'class', 'item');

    // 1. Создаем шапку (header)
    const header = document.createElement('div')
      .chain('setAttribute', 'class', 'item__header');

    // Название — теперь это неинтерактивный параграф вместо textarea
    this.#titleElement = document.createElement('p')
      .chain('setAttribute', 'class', 'item__title');

    // Кнопка Раскрыть/Скрыть детали
    this.#expandButton = document.createElement('button')
      .chain('setAttribute', 'class', 'item__details-button')
      .chain('addEventListener', 'click', () => this.toggleDetails());

    header.chain('append', this.#titleElement, this.#expandButton);

    // 2. Создаем контейнер деталей (по умолчанию скрыт нативно)
    this.#detailsElement = document.createElement('div')
      .chain(Object.assign, { hidden: true });

    // Собираем карточку воедино
    this.chain('append', header, this.#detailsElement);
  }

  // Метод жизненного цикла веб-компонента (срабатывает при рендере в DOM)
  connectedCallback() {
    this.updateUI();
  }

  // Синхронизация интерфейса с данными модели
  updateUI() {
    this.#titleElement.textContent = this.model.data.TITLE;
    
    // Обновляем стрелочку в зависимости от текущего состояния видимости
    const isHidden = this.#detailsElement.hidden;
    this.#expandButton.textContent = isHidden ? '◀' : '▼';
  }

  // Логика отображения/скрытия подробностей
  toggleDetails() {
    const isHidden = this.#detailsElement.hidden;
    this.#detailsElement.hidden = !isHidden;
    
    // Перерисовываем только управляющие элементы интерфейса
    this.updateUI();
  }

  // Метод для добавления вложенных полей в блок деталей (вызывается наследниками вроде TaskView)
  appendDetail(element) {
    this.#detailsElement.chain('append', element);
    return this;
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('item-view', ItemView);

/** ------------------------------------------------------------ */
/** src/entities/base/task-attribute.model.js */
/** ------------------------------------------------------------ */
class TaskAttribute extends Item {
  static poolHrc = new Map(); // Иерархический пул (корневые элементы дерева)

  // Переопределяем метод заполнения пула, чтобы автоматически строить дерево связей
  static set(source) {
    super.set(source); // Заполняет плоский пул poolFlat через ItemModel
    this.poolHrc = new Map();

    // Строим иерархию "родитель-потомок" внутри dataExt
    this.poolFlat.forEach(item => {
      const parentId = +item.data.PARENT;
      if (parentId) {
        const parent = this.get(parentId);
        if (parent) {
          parent.dataExt.children.set(item.data.ID, item);
        }
      } else {
        // Если родителя нет — это корневой элемент дерева
        this.poolHrc.set(item.data.ID, item);
      }
    });
  }

  // Условие для фильтрации на базе объекта и, если требуется - всех его потомков
  static filterCondition(value, hrc = false) {
    let val;
    if (hrc) {
      val = this.getIdsHrc(value);
    } else {
      val = value;
    }
    return { p: `data.${this.ITEM_TYPE}`, v: val };
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

}

/** ------------------------------------------------------------ */
/** src/entities/base/task-attribute.view.js */
/** ------------------------------------------------------------ */
class TaskAttributeView extends HTMLElement {
  model;

  constructor(model) {
    super();
    this.model = model;
    this.chain('setAttribute', 'class', 'attribute-tag');
  }

  connectedCallback() {
    this.updateUI();
  }

  updateUI() {
    this.textContent = this.model.data.TITLE;
  }
}

customElements.define('task-attribute-view', TaskAttributeView);

/** ------------------------------------------------------------ */
/** src/entities/base/task-template.model.js */
/** ------------------------------------------------------------ */
/**
 * Абстрактный предок всех типов задач
 */

class TaskTemplate extends Item {
  static ITEM_TYPE = 'TASK';

  constructor(data) {
    super(data);
  }

  // Проверка статуса выполнения по наличию даты завершения
  completed() {
    return this.data.COMPLETED !== "";
  }

  // Проверка наличия текстовой заметки в задаче
  hasNote() {
    return this.data.NOTE && this.data.NOTE.trim() !== "";
  }

  // Получить ID родительского элемента
  getParentId() {
    return this.data.PARENT || 0;
  }
}

/** ------------------------------------------------------------ */
/** src/entities/base/task-template.view.js */
/** ------------------------------------------------------------ */
class TaskTemplateView extends ItemView {
  
  // Внутренние неинтерактивные элементы интерфейса задачи
  #checkboxElement;
  #noteIconElement;
  #noteTextElement;

  constructor(model) {
    super(model); // Базовый ItemView создаст структуру карточки, заголовок и кнопку деталей

    // 1. Создаем неинтерактивный чекбокс (отображение статуса выполнения)
    this.#checkboxElement = document.createElement('input')
      .chain(Object.assign, { type: 'checkbox', disabled: true })
      .chain('setAttribute', 'class', 'task__check');

    // Нам нужно вставить чекбокс в начало шапки.
    // Так как в ItemView мы не сохраняли ссылку на контейнер header, 
    // мы можем найти его нативно внутри своего элемента:
    const header = this.querySelector('.item__header');
    if (header) {
      header.prepend(this.#checkboxElement);
    }

    // 2. Создаем элементы для отображения заметки (внутри блока деталей)
    const noteContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'task__note-container')
      .chain(Object.assign, { hidden: true }); // По умолчанию скрыта, если текста нет

    this.#noteIconElement = document.createElement('span')
      .chain('setAttribute', 'class', 'task__note-icon')
      .chain(Object.assign, { textContent: '📝 ' });

    // Текст заметки — теперь это строгий неинтерактивный тег <p> вместо <textarea>
    this.#noteTextElement = document.createElement('p')
      .chain('setAttribute', 'class', 'task__note');

    noteContainer.chain('append', this.#noteIconElement, this.#noteTextElement);
    
    // Добавляем контейнер заметки в скрытую область деталей базового ItemView
    this.appendDetail(noteContainer);
  }

  // Переопределяем метод обновления UI, дополняя базовое поведение ItemView
  updateUI() {
    super.updateUI(); // Обновит текст заголовка и стрелочку деталей

    const isCompleted = this.model.completed();
    
    // Синхронизируем состояние нативного чекбокса
    this.#checkboxElement.checked = isCompleted;

    // Стилизация текста заголовка (зачеркивание) через нативный classList
    const titleText = this.querySelector('.item__title');
    if (titleText) {
      if (isCompleted) {
        titleText.classList.add('item__header_checked');
      } else {
        titleText.classList.remove('item__header_checked');
      }
    }

    // Отображение заметки в режиме просмотра
    const noteContainer = this.querySelector('.task__note-container');
    if (noteContainer) {
      if (this.model.hasNote()) {
        this.#noteTextElement.textContent = this.model.data.NOTE;
        noteContainer.hidden = false;
      } else {
        noteContainer.hidden = true;
      }
    }
  }
}

// Регистрируем нативный кастомный элемент для шаблона задачи
customElements.define('task-template-view', TaskTemplateView);

/** ------------------------------------------------------------ */
/** src/entities/folder/folder.model.js */
/** ------------------------------------------------------------ */
class Folder extends TaskAttribute {
  static ITEM_TYPE = 'FOLDER';
}

/** ------------------------------------------------------------ */
/** src/entities/folder/folder.view.js */
/** ------------------------------------------------------------ */
class FolderView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('attribute-tag_type_folder');
  }
}
customElements.define('folder-view', FolderView);

/** ------------------------------------------------------------ */
/** src/entities/context/context.model.js */
/** ------------------------------------------------------------ */
class Context extends TaskAttribute {
  static ITEM_TYPE = 'CONTEXT';
}