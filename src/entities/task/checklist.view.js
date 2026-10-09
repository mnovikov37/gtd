class ChecklistView extends TaskTemplateView {
  #itemsContainer;

  constructor(model) {
    super(model);
    this.classList.add('item_type_checklist');

    // Создаем обертку для списка подпунктов
    this.#itemsContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'checklist__items-box');

    // Оборачиваем контейнер в кирпичик Field для красивого выравнивания структуры
    const checklistField = new AppField('Пункты чеклиста', this.#itemsContainer);
    
    this.appendDetail(checklistField);
  }

  updateUI() {
    super.updateUI(); // Обновляет базовое состояние

    this.#itemsContainer.clear(); // Полностью нативная очистка контейнера через AppElement/HTMLElement

    const childrenModels = this.model.getChildren();

    if (childrenModels.length === 0) {
      this.#itemsContainer.textContent = 'Чеклист пуст';
      return;
    }

    // Рендерим каждый подпункт в режиме "только для чтения"
    childrenModels.forEach(itemModel => {
      const itemRow = document.createElement('div')
        .chain('setAttribute', 'class', 'checklist__item-row');

      // Неинтерактивный мини-чекбокс
      const chk = document.createElement('input')
        .chain(Object.assign, { type: 'checkbox', disabled: true, checked: itemModel.data.COMPLETED !== "" })
        .chain('setAttribute', 'class', 'task__check task__check_type_list-item');

      // Текст подпункта
      const txt = document.createElement('span')
        .chain('setAttribute', 'class', 'checklist__item-text')
        .chain('set', { textContent: itemModel.data.TITLE });
        
      if (itemModel.data.COMPLETED !== "") {
        txt.classList.add('item__header_checked');
      }

      itemRow.chain('append', chk, txt);
      this.#itemsContainer.append(itemRow);
    });
  }
}

customElements.define('checklist-view', ChecklistView);