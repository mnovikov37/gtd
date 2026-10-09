class E {
  #e;                   // Настоящий DOM-элемент
  #visible = true;      // Флаг видимости
  #childComponents = []; // Безопасное хранилище для дочерних компонентов E

  constructor(element = 'div') {
    if (element instanceof HTMLElement) {
      this.#e = element;
    } else {
      this.#e = document.createElement(element);
    }
  }

  // Безопасный геттер для получения DOM-узла наружу, если необходимо
  get(property = 'e') {
    return property === 'e' ? this.#e : this.#e[property];
  }

  value() {
    return this.get('value');
  }

  checkValidity() {
    return this.#e.checkValidity();
  }

  reportValidity() {
    return this._rv(this.#e);
  }

  // Внутренний метод валидации (protected синтаксис через нижнее подчеркивание)
  _rv(element) {
    let result = true;
    if (element.localName === 'input' || element.localName === 'select' || element.localName === 'textarea') {
      result = element.reportValidity();
    } else {
      for (const child of element.children) {
        result = this._rv(child);
        if (!result) break;
      }
    }
    return result;
  }

  clear() {
    this.#e.innerHTML = '';
    this.#childComponents = []; // Очищаем и ссылки на компоненты
  }

  addClass(...classes) {
    this.#e.classList.add(...classes);
    return this;
  }

  removeClass(...classes) {
    this.#e.classList.remove(...classes);
    return this;
  }

  replaceChildren(...nodes) {
    // Преобразуем элементы E в нативные узлы перед передачей
    const nativeNodes = nodes.map(n => n instanceof E ? n.get() : n);
    this.#e.replaceChildren(...nativeNodes);
    
    // Обновляем список дочерних компонентов
    this.#childComponents = nodes.filter(n => n instanceof E);
    return this;
  }

  set(properties) {
    for (let property in properties) {
      if (Object.hasOwn(properties, property)) {
        this.#e[property] = properties[property];
      }
    }
    return this;
  }

  setCustomValidity(v) {
    this.#e.setCustomValidity(v);
  }

  addEventListener(types, callback) {
    if (Array.isArray(types)) {
      types.forEach(type => this.#e.addEventListener(type, callback));
    } else {
      this.#e.addEventListener(types, callback);
    }
    return this;
  }

  dispatchEvent(ev) {
    this.#e.dispatchEvent(ev);
  }

  // Изменено на публичный метод управления видимостью, чтобы избежать ошибок TypeError в наследниках
  setVisible(v) {
    this.#visible = v;
    if (!v) {
      this.#e.style.display = 'none'; // Интегрируем скрытие на уровне DOM
    } else {
      this.#e.style.removeProperty('display');
    }
    // Безопасно передаем статус видимости вглубь по изолированному массиву
    this.#childComponents.forEach(child => child.setVisible(v));
  }

  // Внутренний метод аппенда с регистрацией
  _appendPrepend(title, element, prepend = false) {
    let el;
    if (element instanceof E) {
      el = element;
    } else if (element instanceof HTMLElement) {
      el = new E(element);
    } else {
      throw new TypeError('Can append only E or HTMLElement');
    }

    el.setVisible(this.#visible);
    
    // Регистрируем как свойство текущего объекта для быстрого доступа по имени
    this[title] = el;
    // Сохраняем в изолированный массив для системных обходов (render, visibility)
    this.#childComponents.push(el);

    if (prepend) {
      this.#e.prepend(el.get());
    } else {
      this.#e.append(el.get());
    }
  }

  append(element) {
    this._appendPrepend('x', element);
    return this;
  }

  prepend(element) {
    this._appendPrepend('x', element, true);
    return this;
  }

  hide() {
    this.#visible = false;
    this.e.remove();
    return this;
  }

  // Метод, который наследники МОГУТ переопределять для обновления своих данных
  updateUI() {}

  render() {
    this.updateUI(); // Вызываем кастомное обновление компонента
    
    // Безопасно запускаем рендер дочерних элементов
    this.#childComponents.forEach(child => {
      child.render();
    });
    return this;
  }

  remove() {
    this.setVisible(false);
    this.#e.remove();
    return this;
  }
}