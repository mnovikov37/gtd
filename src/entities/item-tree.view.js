class ItemTreeView extends ItemView {
  renderDetails(details) {
  //  details.textContent = '[ ItemTree UI details ]';
  }
}

// Регистрируем нативный кастомный элемент
customElements.define('item-tree-view', ItemTreeView, { extends : 'details' });