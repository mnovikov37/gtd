class E {

  e;

  constructor(element) {
    if (element instanceof HTMLElement) {
      this.e = element;
    } else {
      this.e = document.createElement(element);
    }
  }

  get(property = 'e') {
    let result = null;
    if (property == 'e') {
      result = this.e;
    } else {
      result = this.e[property];
    }
    return result;
  }

  value() {
    return this.get('value');
  }

  checkValidity() {
    return this.e.checkValidity();
  }

  reportValidity() {
    return this.rv(this.e);
  }

  // reportValidity рекурсивно по всем вложенным элементам
  rv(element) {
    
    let result = true;
    if (element.localName === 'input' || element.localName === 'select' || element.localName === 'textarea') {
      result = element.reportValidity();
    } else {
      for (const child of element.children) {
        result = this.rv(child);
        if (!result) break;
      }
    }
    return result;
  }

  clear() {
    this.e.innerHTML = '';
  }

  addClass(...classes) {
    this.e.classList.add(...classes);
    return this;
  }

  removeClass(...classes) {
    this.e.classList.remove(...classes);
    return this;
  }

  replaceChildren(...nodes) {
    this.e.replaceChildren(...nodes);
    return this;
  }

  set(properties) {
    for (let property in properties) {
      this.e[property] = properties[property];
    }
    return this;
  }

  setCustomValidity(v) {
    this.e.setCustomValidity(v);
  }

  addEventListener(types, callback) {
    if (Array.isArray(types)) {
      types.forEach(type => this.e.addEventListener(type, callback));
    } else {
      this.e.addEventListener(types, callback);
    }
    return this;
  }

  dispatchEvent(ev) {
    this.e.dispatchEvent(ev);
  }

  append(...elements) {
    elements.forEach(e => {
      if (e instanceof E) {
        this.e.append(e.get());
      } else {
        this.e.append(e);
      }
    });
    return this;
  }

  prepend(...elements) {
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i] instanceof E) {
        this.e.prepend(elements[i].get());
      } else {
        this.e.prepend(elements[i]);
      }
    }
    return this;
  }

  remove() {
    this.e.remove();
    return this;
  }

}