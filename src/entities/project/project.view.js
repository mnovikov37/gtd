class ProjectView extends TaskAttributeView {
  #childrenContainer;

  constructor(model) {
    super(model);
    this.classList.add('attribute-tag_type_project');
    
    this.#childrenContainer = document.createElement('div')
      .chain('setAttribute', 'class', 'attribute-tag__children');
    this.append(this.#childrenContainer);
  }

  updateUI() {
    const titleNode = this.firstChild && this.firstChild.nodeType === Node.TEXT_NODE 
      ? this.firstChild 
      : document.createTextNode('');
    
    titleNode.textContent = this.model.data.TITLE;
    if (!this.contains(titleNode)) this.prepend(titleNode);

    this.#childrenContainer.clear();
    
    // Рекурсивно рендерим подпроекты
    this.model.dataExt.children.forEach(childModel => {
      this.#childrenContainer.append(new ProjectView(childModel));
    });
  }
}
customElements.define('project-view', ProjectView);