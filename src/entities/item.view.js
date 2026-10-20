class ItemView extends HTMLDetailsElement {
  #model = null; // Ссылка на связанную модель данных
  
  // ----- Элементы UI ----- //
  #uiTitle = null;
  #uiNoteIcon = null;
  #uiNote = null;
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
    if (this.open) {
      super.open = false; 
    }
    this.replaceChildren();

    this.#uiTitle = null;
    this.#uiDetails = null;
    this.#uiNoteIcon = null;
    this.#uiNote = null;
    
    // ----- summary ----- //
    const summary = document.createElement('summary');
    // ----- title ----- //
    this.#uiTitle = document.createElement('p');
    this.#uiTitle.classList.add('item__title');
    this.#uiTitle.textContent = this.#model.data.TITLE;
    // ----- note ----- //
    if (this.#model.data.NOTE !== undefined && this.#model.data.NOTE.trim() !== '') {
      this.#uiNoteIcon = document.createElement('p');
      this.#uiNoteIcon.classList.add('item__note-icon');
      this.#uiNoteIcon.textContent = '📝';
      this.#uiNote = document.createElement('p');
      this.#uiNote.classList.add('item__note');
      this.#uiNote.textContent = this.#model.data.NOTE;
      this.#uiNote.addEventListener('click', () => { this.#uiNote.classList.toggle('item__note_expanded') });
    }
    // Собрать UI
    summary.append(this.#uiTitle);
    if (this.#uiNote) {
      summary.append(this.#uiNote);
    }
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