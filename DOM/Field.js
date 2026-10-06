class Field extends E {

  title;
  field;

  constructor(title, field = null) {
    super('div');

    this.addClass('field');
    this.title = new E('p').set({ textContent : `${title} :` });
    this.field = field ? field : new E('p').set({ textContent : '[ null ]' });
    this.append(this.title, this.field);
  }

  setTitle(title) {
    this.title.set({ textContent : `${title} :` });
    return this;
  }

  setCustomValidity(v) {
    this.field.setCustomValidity(v);
  }

  reportValidity() {
    return this.field.reportValidity();
  }

  value() {
    return this.field instanceof E ? this.field.get('value') : this.field.value;
  }

  setField(field) {
    this.field.remove();
    this.field = field;
    this.append(this.field);
    return this;
  }

}