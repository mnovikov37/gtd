class PriorityView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(`attribute-tag_priority_${this.model.data.ID}`);
  }
}
customElements.define('priority-view', PriorityView);