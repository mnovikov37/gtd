class TaskView extends ItemTreeView {
  #uiCheck = null;

  render() {
    super.render();

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

  renderDetails(details) {
    const fragment = document.createDocumentFragment();

    const dueDate = document.createElement('my-field');
    dueDate.title = 'Дата завершения'
    const dueDateF = document.createElement('p');
    dueDateF.textContent = this.model.data.DUE_DATE === '' ? Select.OPTION_NO__TEXT : this.model.data.DUE_DATE
    dueDate.field = dueDateF;

    fragment.append(
      this.#renderField('Тип'               , TaskType, 'TYPE'    ),
      dueDate,
      this.#renderField('Цель'              , Goal    , 'GOAL'    ),
      this.#renderField('Проект / чеклист'  , Task    , 'PARENT'  ),
      this.#renderField('Папка'             , Folder  , 'FOLDER'  ),
      this.#renderField('Контекст'          , Context , 'CONTEXT' ),
      this.#renderField('Приоритет'         , Priority, 'PRIORITY'),
    );

    details.append(fragment);
  }

  #renderField(title, itemClass, key) {
    const result = document.createElement('my-field');
    result.title = title;
    const f = document.createElement('p');
    const id = this.model.data[key];
    const item = itemClass.get(id)
    if (id !== 0 && item === undefined) {
      throw new ReferenceError(`Not found ${itemClass.name} with ID = [${id}]`);
    }
    f.textContent = item ? item.data.TITLE : Select.OPTION_NO__TEXT;
    result.field = f;
    return result;
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('task-view', TaskView, { extends : 'details' });