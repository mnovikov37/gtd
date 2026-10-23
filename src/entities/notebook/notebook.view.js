class NotebookView extends ItemView {


  render() {
    super.render();

    const icon = document.createElement('p');
    icon.classList.add('task__check');
    icon.textContent = '📝';

    this.uiSummary.prepend(icon);
  }

}

// Регистрируем нативный кастомный элемент
customElements.define('notebook-view', NotebookView, { extends: 'details' });