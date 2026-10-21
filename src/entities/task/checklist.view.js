class ChecklistView extends TaskView {

  renderDetails(details) {
    super.renderDetails(details);
    const fragment = document.createDocumentFragment();

    this.model.children.forEach(item => {
      fragment.append(item.ui);
    });

    details.append(fragment);
  }

}

// Регистрируем нативный кастомный элемент
customElements.define('checklist-view', ChecklistView, { extends : 'details' });