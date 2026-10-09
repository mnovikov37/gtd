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