class ChecklistItemView extends TaskTemplateView {
  #parentChecklistField;

  constructor(model) {
    super(model);
    
    // Добавляем BEM-класс для специфичной стилизации подпункта
    this.classList.add('item_type_checklist-item');

    // Настраиваем шапку: меняем стиль чекбокса на круглый, как было в вашем оригинальном CSS
    const checkbox = this.querySelector('.task__check');
    if (checkbox) {
      checkbox.classList.add('task__check_type_list-item');
    }

    // Создаем неинтерактивное поле "Чеклист" (вместо старого селекта) для блока деталей
    this.#parentChecklistField = new AppField('Чеклист');
    
    this.appendDetail(this.#parentChecklistField);
  }

  updateUI() {
    super.updateUI(); // Обновляет базовое состояние, чекбокс и текст заголовка

    // Наполняем текстовым значением из модели
    const parentTitle = this.model.getChecklistTitle();
    this.#parentChecklistField.setField(
      document.createElement('span').chain('set', { textContent: parentTitle })
    );
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('checklist-item-view', ChecklistItemView);