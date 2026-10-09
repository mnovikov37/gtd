class TaskAttributeView extends HTMLElement {
  model;

  constructor(model) {
    super();
    this.model = model;
    this.chain('setAttribute', 'class', 'attribute-tag');
  }

  connectedCallback() {
    this.updateUI();
  }

  updateUI() {
    this.textContent = this.model.data.TITLE;
  }
}

customElements.define('task-attribute-view', TaskAttributeView);