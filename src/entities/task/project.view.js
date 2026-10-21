class ProjectView extends ChecklistItemView {

  renderDetails(details) {
    const fragment = document.createDocumentFragment();

    fragment.append(
      this.renderField('Тип'      , TaskType, 'TYPE'    ),
      this.renderField('Цель'     , Goal    , 'GOAL'    ),
      this.renderField('Проект'   , Task    , 'PARENT'  ),
    );

    details.append(fragment);
  }

  renderField(title, itemClass, key) {
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
customElements.define('project-view', ProjectView, { extends : 'details' });