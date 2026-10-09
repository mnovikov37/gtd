class GoalView extends TaskAttributeView {
  #childrenContainer;

  constructor(model) {
    super(model);
    this.classList.add('attribute-tag_type_goal');
    
    // Создаем контейнер для подцелей с отступом
    this.#childrenContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'attribute-tag__children');
    this.append(this.#childrenContainer);
  }

  updateUI() {
    // Чтобы не затереть контейнер детей, обновляем только текстовый узел самого элемента
    const titleNode = this.firstChild && this.firstChild.nodeType === Node.TEXT_NODE 
      ? this.firstChild 
      : document.createTextNode('');
    
    titleNode.textContent = this.model.data.TITLE;
    if (!this.contains(titleNode)) this.prepend(titleNode);

    this.#childrenContainer.clear();
    
    // Рекурсивно рендерим все подцели
    this.model.dataExt.children.forEach(childModel => {
      this.#childrenContainer.append(new GoalView(childModel));
    });
  }
}
customElements.define('goal-view', GoalView);