class Item {
  static DUMP_KEY  = 'ITEM';           // Тип сущности в дампе (сущности ITEM в дампе нет, она чисто абстрактная)
  static VIEW__EDIT = 'item-edit-view'; // Тег кастомного элемента HTML - интерфейса для редактирования сущности
  static pool = new Map();          // Хранилище объектов (аналог таблицы БД)
  static maxId = 0;                     // Надо помнить максимальный ID в пуле сущностей

  data;               // Данные из дампа, которые пойдут обратно в дамп
  dataExt;            // Дополнительные рантайм-данные приложения. В дамп не идут
  view = 'item-view'  // Тег кастомного элемента HTML - интерфейса для отображения сущности
  #ui;                // Пользовательский интерфейс

  // Заполнение пула объектов из исходного дампа
  static init(source) {
    this.maxId = 0;
    this.pool = new Map();
    source[this.DUMP_KEY].forEach((data) => {
      this.pool.set(data.ID, new this(data));
      if (data.ID > this.maxId) this.maxId = data.ID;
    });
  }

  // Получить объект из пула по ID
  static get(id) {
    return this.pool.get(id); 
  }

  // Добавить новый объект в пул
  static add(item) {
    if (item.constructor === this) {
      if (!item.data.ID) {
        this.maxId = this.maxId + 1;
        item.data.ID = this.maxId;
        item.data.CREATED = nowWithMs();
        item.data.MODIFIED = item.data.CREATED;
        Loader.data[this.DUMP_KEY].push(item.data); // Включить новый объект в дамп
      }
      this.pool.set(item.data.ID, item);
    } else {
      throw new TypeError(`Попытка добавить ${item.constructor.name} в пул ${this.name}`);
    }
  }

  // Удалить объект из пула по ID
  static delete(id) {
    this.pool.delete(id);
  }

  static filter(conditions) { 
    return filterMap(this.pool, conditions);
  }

  constructor(data) {
    this.data = data;
  }

  get ui() {
    if (!this.#ui) {
      this.#ui = document.createElement('details', { is: this.view });
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