class ItemView extends HTMLElement {
  model; // Ссылка на связанную модель данных
  
  // Внутренние ссылки на DOM-элементы карточки
  #titleElement;
  #detailsElement;
  #expandButton;

  constructor(model) {
    super();
    this.model = model;

    // Настраиваем базовый контейнер карточки
    this.chain('setAttribute', 'class', 'item');

    // 1. Создаем шапку (header)
    const header = document.createElement('div')
      .chain('setAttribute', 'class', 'item__header');

    // Название — теперь это неинтерактивный параграф вместо textarea
    this.#titleElement = document.createElement('p')
      .chain('setAttribute', 'class', 'item__title');

    // Кнопка Раскрыть/Скрыть детали
    this.#expandButton = document.createElement('button')
      .chain('setAttribute', 'class', 'item__details-button')
      .chain('addEventListener', 'click', () => this.toggleDetails());

    header.chain('append', this.#titleElement, this.#expandButton);

    // 2. Создаем контейнер деталей (по умолчанию скрыт нативно)
    this.#detailsElement = document.createElement('div')
      .chain(Object.assign, { hidden: true });

    // Собираем карточку воедино
    this.chain('append', header, this.#detailsElement);
  }

  // Метод жизненного цикла веб-компонента (срабатывает при рендере в DOM)
  connectedCallback() {
    this.updateUI();
  }

  // Синхронизация интерфейса с данными модели
  updateUI() {
    this.#titleElement.textContent = this.model.data.TITLE;
    
    // Обновляем стрелочку в зависимости от текущего состояния видимости
    const isHidden = this.#detailsElement.hidden;
    this.#expandButton.textContent = isHidden ? '◀' : '▼';
  }

  // Логика отображения/скрытия подробностей
  toggleDetails() {
    const isHidden = this.#detailsElement.hidden;
    this.#detailsElement.hidden = !isHidden;
    
    // Перерисовываем только управляющие элементы интерфейса
    this.updateUI();
  }

  // Метод для добавления вложенных полей в блок деталей (вызывается наследниками вроде TaskView)
  appendDetail(element) {
    this.#detailsElement.chain('append', element);
    return this;
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('item-view', ItemView);