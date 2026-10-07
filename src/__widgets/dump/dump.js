class Dump extends DOMElement{
  updateUI() {
    this.ui.content = new E('textarea').set({ value : JSON.stringify(Loader.data, null, '\t') });
    this.ui.append(this.ui.content);
  }

}