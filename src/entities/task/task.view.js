class TaskView extends ProjectView {

  renderDetails(details) {
    super.renderDetails(details);
    const fragment = document.createDocumentFragment();

    const dueDate = document.createElement('my-field');
    dueDate.title = 'Дата завершения'
    const dueDateF = document.createElement('p');
    dueDateF.textContent = this.model.data.DUE_DATE === '' ? Select.OPTION_NO__TEXT : this.model.data.DUE_DATE
    dueDate.field = dueDateF;

    fragment.append(
      dueDate,
      this.renderField('Папка'    , Folder  , 'FOLDER'  ),
      this.renderField('Контекст' , Context , 'CONTEXT' ),
      this.renderField('Приоритет', Priority, 'PRIORITY'),
    );

    details.append(fragment);
  }

}

// Регистрируем нативный кастомный элемент
customElements.define('task-view', TaskView, { extends : 'details' });