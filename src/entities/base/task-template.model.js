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