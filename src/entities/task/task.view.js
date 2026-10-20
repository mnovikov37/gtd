class TaskView extends ItemTreeView {

  // ----- Элементы UI ----- //

  renderDetails(details) {
    const dueDate = document.createElement('my-field');
    dueDate.title = 'Дата завершения'
    const dueDateF = document.createElement('p');
    dueDateF.textContent = this.model.data.DUE_DATE === '' ? Select.OPTION_NO__TEXT : this.model.data.DUE_DATE
    dueDate.field = dueDateF;

    details.append(
      this.#renderField('Тип'               , TaskType, 'TYPE'    ),
      dueDate,
      this.#renderField('Цель'              , Goal    , 'GOAL'    ),
      this.#renderField('Проект / чеклист'  , Task    , 'PARENT'  ),
      this.#renderField('Папка'             , Folder  , 'FOLDER'  ),
      this.#renderField('Контекст'          , Context , 'CONTEXT' ),
      this.#renderField('Приоритет'         , Priority, 'PRIORITY'),
    );
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
    f.textContent = item ? itemClass.get(this.model.data[key]).data.TITLE : Select.OPTION_NO__TEXT;
    result.field = f;
    return result;
  }
}



// Регистрируем нативный кастомный элемент
customElements.define('task-view', TaskView, { extends : 'details' });