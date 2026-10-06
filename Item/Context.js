class Context extends TaskAttribute {
  static ITEM_TYPE = 'CONTEXT';
  static attribute = 'data.CONTEXT';

  updateUI() {
    this.ui.set({ textContent : `Контекст [${this.data.TITLE}]` });
  }
}