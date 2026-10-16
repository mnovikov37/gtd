class ItemView extends HTMLDetailsElement {
  #model = null; // Ссылка на связанную модель данных
  
  // ----- Элементы UI ----- //
  #uiTitle = null;
  #uiDetails = null;
  
  constructor() {
    super();
    this.classList.add('item');
    this.addEventListener('toggle', () => {this.#handleToggle()});
  }

  init(model) {
    if (this.#model) {
      throw new TypeError('Reinitialization is prohibited');
    }
    this.#model = model;
  }

  get model() {
    return this.#model;
  }

  connectedCallback() {
      this.render();
  }

  render() {
    if(!this.#model) {
      throw new Error('Cannot render without model');
    }
    this.open = false;
    this.replaceChildren();
    this.#uiTitle = null;
    this.#uiDetails = null;
    // ----- summary ----- //
    const summary = document.createElement('summary');
    // ----- title ----- //
    this.#uiTitle = document.createElement('p');
    this.#uiTitle.classList.add('item__title');
    this.#uiTitle.textContent = this.#model.data.TITLE;
    // Собрать UI
    summary.append(this.#uiTitle);
    this.append(summary);
  }

  #handleToggle() {
    if (this.#uiDetails) {
      this.#uiDetails.remove();
      this.#uiDetails = null;
    }
    if (this.open) {
      this.#uiDetails = document.createElement('div');
      this.renderDetails(this.#uiDetails);
      this.append(this.#uiDetails);
    }
  }

  renderDetails(details) {
    //details.textContent = '[ UI details ]';
  }
}
// Регистрируем нативный кастомный элемент
customElements.define('item-view', ItemView, { extends : 'details' });