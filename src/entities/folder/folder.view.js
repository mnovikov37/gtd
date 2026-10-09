class FolderView extends TaskAttributeView {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('attribute-tag_type_folder');
  }
}
customElements.define('folder-view', FolderView);