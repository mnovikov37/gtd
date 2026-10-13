class ItemView extends HTMLElement {
  model; // Ссылка на связанную модель данных
  
  constructor(model) {
    super();
    this.model = model;

    this.classList.add('item');
      // ----- header ----- //
      this.header = document.createElement('div');
      const h = this.header;
      h.classList.add('item__header');
        // ----- header.tl ----- //
        this.header.tl = document.createElement('p');
        const tl = this.header.tl;
        tl.classList.add('item__title');
        tl.textContent = model.data.TITLE;
        // ----- header.expandDetails ----- //
        this.header.expandDetails = document.createElement('button');
        const ed = this.header.expandDetails;
        ed.classList.add('item__details-button');
        ed.textContent = '<';
      h.append(tl, ed);
    this.append(h);
    /*
    chain('addEventListener', 'click', () => this.toggleDetails());

    header.chain('append', this.#titleElement, this.#expandButton);

    // 2. Создаем контейнер деталей (по умолчанию скрыт нативно)
    this.#detailsElement = document.createElement('div')
      .chain(Object.assign, { hidden: true });

    // Собираем карточку воедино
    this.chain('append', header, this.#detailsElement);
    */
  }

  /*
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
    */
}

// Регистрируем нативный кастомный элемент
customElements.define('item-view', ItemView);