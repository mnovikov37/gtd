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