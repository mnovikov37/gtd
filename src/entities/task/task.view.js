class TaskView extends TaskTemplateView {
  // Неинтерактивные элементы отображения атрибутов
  #folderField;
  #projectField;
  #priorityField;
  #contextField;
  #dateField;

  constructor(model) {
    super(model);

    // Добавляем специфичный класс для стилизации задач
    this.classList.add('item_type_task');

    // Инициализируем неинтерактивные «кирпичики» для блока деталей
    this.#folderField = new AppField('Папка');
    this.#projectField = new AppField('Проект');
    this.#priorityField = new AppField('Приоритет');
    this.#contextField = new AppField('Контекст');
    this.#dateField = new AppField('Срок');

    // Нативно аппендим все поля в скрытый блок деталей базового ItemView
    this.appendDetail(this.#folderField)
        .appendDetail(this.#projectField)
        .appendDetail(this.#priorityField)
        .appendDetail(this.#contextField)
        .appendDetail(this.#dateField);
  }

  updateUI() {
    super.updateUI(); // Обновит шапку, чекбокс и заметку

    // Наполняем кирпичики текстовыми значениями из модели (вместо селектов!)
    this.#folderField.setField(document.createElement('span').chain('set', { textContent: this.model.getFolderTitle() }));
    this.#projectField.setField(document.createElement('span').chain('set', { textContent: this.model.getProjectTitle() }));
    this.#priorityField.setField(document.createElement('span').chain('set', { textContent: this.model.getPriorityTitle() }));
    this.#contextField.setField(document.createElement('span').chain('set', { textContent: this.model.getContextTitle() }));
    
    const dueDate = this.model.getDueDate();
    this.#dateField.setField(document.createElement('span').chain('set', { textContent: dueDate || 'Не задан' }));
  }
}

customElements.define('task-view', TaskView);