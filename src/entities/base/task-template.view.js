class TaskTemplateView extends ItemView {
  
  // Внутренние неинтерактивные элементы интерфейса задачи
  #checkboxElement;
  #noteIconElement;
  #noteTextElement;

  constructor(model) {
    super(model); // Базовый ItemView создаст структуру карточки, заголовок и кнопку деталей

    // 1. Создаем неинтерактивный чекбокс (отображение статуса выполнения)
    this.#checkboxElement = document.createElement('input')
      .chain(Object.assign, { type: 'checkbox', disabled: true })
      .chain('setAttribute', 'class', 'task__check');

    // Нам нужно вставить чекбокс в начало шапки.
    // Так как в ItemView мы не сохраняли ссылку на контейнер header, 
    // мы можем найти его нативно внутри своего элемента:
    const header = this.querySelector('.item__header');
    if (header) {
      header.prepend(this.#checkboxElement);
    }

    // 2. Создаем элементы для отображения заметки (внутри блока деталей)
    const noteContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'task__note-container')
      .chain(Object.assign, { hidden: true }); // По умолчанию скрыта, если текста нет

    this.#noteIconElement = document.createElement('span')
      .chain('setAttribute', 'class', 'task__note-icon')
      .chain(Object.assign, { textContent: '📝 ' });

    // Текст заметки — теперь это строгий неинтерактивный тег <p> вместо <textarea>
    this.#noteTextElement = document.createElement('p')
      .chain('setAttribute', 'class', 'task__note');

    noteContainer.chain('append', this.#noteIconElement, this.#noteTextElement);
    
    // Добавляем контейнер заметки в скрытую область деталей базового ItemView
    this.appendDetail(noteContainer);
  }

  // Переопределяем метод обновления UI, дополняя базовое поведение ItemView
  updateUI() {
    super.updateUI(); // Обновит текст заголовка и стрелочку деталей

    const isCompleted = this.model.completed();
    
    // Синхронизируем состояние нативного чекбокса
    this.#checkboxElement.checked = isCompleted;

    // Стилизация текста заголовка (зачеркивание) через нативный classList
    const titleText = this.querySelector('.item__title');
    if (titleText) {
      if (isCompleted) {
        titleText.classList.add('item__header_checked');
      } else {
        titleText.classList.remove('item__header_checked');
      }
    }

    // Отображение заметки в режиме просмотра
    const noteContainer = this.querySelector('.task__note-container');
    if (noteContainer) {
      if (this.model.hasNote()) {
        this.#noteTextElement.textContent = this.model.data.NOTE;
        noteContainer.hidden = false;
      } else {
        noteContainer.hidden = true;
      }
    }
  }
}

// Регистрируем нативный кастомный элемент для шаблона задачи
customElements.define('task-template-view', TaskTemplateView);