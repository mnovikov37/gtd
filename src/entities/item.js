class Item {
  static ITEM_TYPE  = 'ITEM';           // Тип сущности в дампе (сущности ITEM в дампе нет, она чисто абстрактная)
  static VIEW__SHOW = 'item-view';      // Тег кастомного элемента HTML - интерфейса для отображения сущности
  static VIEW__EDIT = 'item-edit-view'; // Тег кастомного элемента HTML - интерфейса для редактирования сущности
  static poolFlat = new Map();          // Хранилище объектов (аналог таблицы БД)
  static maxId = 0;                     // Надо помнить максимальный ID в пуле сущностей

  data;     // Данные из дампа, которые пойдут обратно в дамп
  dataExt;  // Дополнительные рантайм-данные приложения. В дамп не идут
  #ui;      // Пользовательский интерфейс

  // Заполнение пула объектов из исходного дампа
  static init(source) {
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
    //this.dataExt = { children: new Map() }; Возможно, переедет в ItemTree
  }

  get ui() {
    if (!this.#ui) {
      this.#ui = document.createElement('details', { is: this.constructor.VIEW__SHOW });
      this.#ui.init(this);
    }
    return this.#ui;
  }

  destroyUi() {
    if (this.#ui) {
      this.#ui.remove();
      this.#ui = null;
    }
  }

}