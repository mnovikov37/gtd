class ChecklistItemView extends ItemView {
  #uiCheck = null;

  render() {
    super.render();

    if (this.constructor == ChecklistItemView) {
      this.classList.add('checklist-item');
    }

    const isChecked = this.model.data.COMPLETED !== "";
    if (isChecked) {
      this.uiTitle.classList.add('item__title_checked');
    }

    this.#uiCheck = document.createElement('input');
    this.#uiCheck.type = 'checkbox';
    this.#uiCheck.classList.add('task__check');
    this.#uiCheck.checked = isChecked;
    this.#uiCheck.addEventListener('click', (e) => {
      e.preventDefault();
    });
    
    this.uiSummary.prepend(this.#uiCheck);
  }

}

// Регистрируем нативный кастомный элемент
customElements.define('checklist-item-view', ChecklistItemView, { extends : 'details' });