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