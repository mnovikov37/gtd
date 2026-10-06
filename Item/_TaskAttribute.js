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