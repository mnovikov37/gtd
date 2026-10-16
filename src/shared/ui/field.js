/**
 * ----------------------------------------
 * Поле: любой HTML элемент + текстовое пояснение к нему:
 *  ┌─────────┬───────┐
 *  │ title : │ field │
 *  └─────────┴───────┘
 * Может не содержать никакого элемента. В таком случае вместо field будет отображаться абзац с текстом "[null]":
 *  ┌─────────┬────────┐
 *  │ title : │ [null] │
 *  └─────────┴────────┘
 * ----------------------------------------
 * Что может:
 *  - setTitle(title)       - изменить пояснение
 *  - setField(field)       - заменить вложенный элемент на новый
 *  - setCustomValidity(v)  - задать кастомную валидацию для вложенного элемента
 *  - reportValidity()      - валидация данных, введённых пользователем во вложенный элемент
 *  - value()               - получить value вложенного элемента
 */
class Field extends HTMLElement {

  _titleText = undefined;
  _fieldElement = undefined;
  _titleNode = undefined;
  _fieldNode = undefined;

  set title(text) {
    if (this._titleText !== undefined) {
      throw new Error('title can only be assigned once');
    }
    this._titleText = text;
  }

  set field(element) {
    if (this._fieldElement !== undefined) {
      throw new Error('field can only be assigned once');
    }
    this._fieldElement = element;
  }

  // Геттер value возвращает значение вложенного элемента (или null, если элемента нет)
  get value() {
    return this._fieldNode && this._fieldNode.value !== undefined ? this._fieldNode.value : null;
  }

  setCustomValidity(v) {
    // Проверяем наличие метода, чтобы не упасть, если внутри обычный параграф [null]
    if (this._fieldNode && typeof this._fieldNode.setCustomValidity === 'function') {
      this._fieldNode.setCustomValidity(v);
    }
  }

  reportValidity() {
    if (this._fieldNode && typeof this._fieldNode.reportValidity === 'function') {
      return this._fieldNode.reportValidity();
    }
    return true; // Если элемент не поддерживает валидацию, считаем его валидным
  }

  connectedCallback() {
    this.classList.add('field');
    this.replaceChildren();

    // Создаем и добавляем заголовок
    this._titleNode = document.createElement('p');
    this._titleNode.classList.add('field__title');
    this._titleNode.textContent = `${this._titleText || ''} :`;
    this.append(this._titleNode);

    // Создаем и добавляем тело поля
    if (this._fieldElement) {
      this._fieldNode = this._fieldElement;
    } else {
      this._fieldNode = document.createElement('p');
      this._fieldNode.textContent = '[null]';
    }
    this.append(this._fieldNode);
  }

}

// Регистрация нативного кастомного элемента
customElements.define('my-field', Field);