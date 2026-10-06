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