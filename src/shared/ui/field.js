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

  title;
  field;

  constructor(title, field = null) {
    super();

    this.classList.add('field');
    this.title = document.createElement('p');
    this.title.textContent =  `${title} :`;
    this.append(this.title);
    this.field = field ? field : document.createElement('p');
    if (!field) {
      this.field.textContent = '[null]';
    }
    this.append(this.title, this.field);
  }

  setTitle(title) {
    this.title.set({ textContent : `${title} :` });
  }

  setField(field) {
    this.field.remove();
    this.field = field;
    this.append(this.field);
  }

  setCustomValidity(v) {
    this.field.setCustomValidity(v);
  }

  reportValidity() {
    return this.field.reportValidity();
  }

  value() {
    return this.field.value;
  }

}

// Регистрация нативного кастомного элемента
customElements.define('my-field', Field);