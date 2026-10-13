class ContextView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('attribute-tag_type_context');
  }
}
customElements.define('context-view', ContextView);