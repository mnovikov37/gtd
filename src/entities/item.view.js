class ItemView extends HTMLDetailsElement {
  #model = null; // Ссылка на связанную модель данных
  #isInitialized = false; // Флаг, чтобы избежать повторного рендера при перемещении в DOM
  
  // ----- Элементы UI ----- //
  #uiSummary = null;
  #uiTitle = null;
  #uiNote = null;
  #uiDetails = null;
  
  constructor() {
    super();
    this.classList.add('item');
    
    // Делегирование событий: вешаем слушатели один раз в конструкторе
    this.addEventListener('toggle', () => this.#handleToggle());
    this.addEventListener('click', (e) => this.#handleCanvasClick(e));
  }

  init(model) {
    if (this.#model) {
      throw new TypeError('Reinitialization is prohibited');
    }
    this.#model = model;
    // Если элемент уже был добавлен в DOM до вызова init, запускаем рендер
    if (this.isConnected && !this.#isInitialized) {
      this.render();
    }
  }

  get uiSummary() {
    return this.#uiSummary;
  }

  get uiTitle() {
    return this.#uiTitle;
  }

  get model() {
    return this.#model;
  }

  connectedCallback() {
      // Рендерим только если есть модель и элемент еще не был инициализирован
      if (this.#model && !this.#isInitialized) {
          this.render();
      }
  }

  render() {
    if (!this.#model) {
      throw new Error('Cannot render without model');
    }

    this.#isInitialized = true;
    this.replaceChildren();

    // Сбрасываем ссылки на UI элементы
    this.#uiDetails = null;
    this.#uiNote = null;
    
    // ----- summary ----- //
    this.#uiSummary = document.createElement('summary');
    
    // ----- title ----- //
    this.#uiTitle = document.createElement('p');
    this.#uiTitle.classList.add('item__title');
    this.#uiTitle.textContent = this.#model.data.TITLE;
    this.#uiSummary.append(this.#uiTitle);
    
    // ----- note ----- //
    if (this.#model.data.NOTE !== undefined && this.#model.data.NOTE.trim() !== '') {
      this.#uiNote = document.createElement('p');
      this.#uiNote.classList.add('item__note');
      this.#uiNote.textContent = this.#model.data.NOTE;
      this.#uiSummary.append(this.#uiNote);
    }
    
    this.append(this.#uiSummary);

    // Если компонент рендерится уже открытым, сразу создаем детали
    if (this.open) {
      this.#createDetails();
    }
  }

  #handleToggle() {
    if (this.open) {
      this.#createDetails();
    } else {
      this.#destroyDetails();
    }
  }

  #createDetails() {
    if (!this.#uiDetails) {
      this.#uiDetails = document.createElement('div');
      this.renderDetails(this.#uiDetails);
      this.append(this.#uiDetails);
    }
  }

  #destroyDetails() {
    if (this.#uiDetails) {
      this.#uiDetails.remove();
      this.#uiDetails = null;
    }
  }

  // Централизованная обработка кликов для экономии памяти
  #handleCanvasClick(e) {
    const noteElement = e.target.closest('.item__note');
    if (noteElement) {
      e.preventDefault(); // Сбросить дефолтное поведение клика - иначе развернёт всю карточку сущности, а не только заметку
      e.stopPropagation(); // Предотвращаем нативное открытие/закрытие <details>
      if (window.getSelection().toString().length === 0) {
        noteElement.classList.toggle('item__note_expanded');
      }
    }
  }

  renderDetails(details) {
    // details.textContent = '[ UI details ]';
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('item-view', ItemView, { extends: 'details' });