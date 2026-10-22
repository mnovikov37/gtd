class Node {  // Любая сущность, имеющая представление в пользовательском интерфейсе
  static VIEW__ELEMENT = 'div';    // На базе какого HTML элемента будет строиться интерфейс
  static VIEW__EDIT    = 'div'; // Тег кастомного элемента HTML - интерфейса для редактирования сущности

  view = 'node-view' // Тег кастомного элемента HTML - интерфейса для отображения сущности
  #ui;         // Пользовательский интерфейс

  get ui() {
    if (!this.#ui) {
      this.#ui = document.createElement(this.constructor.VIEW__ELEMENT, { is: this.view });
      this.#ui.init(this);
    }
    return this.#ui;
  }

  destroyUi() {
    if (this.#ui) {
      this.#ui.remove();
      this.#ui = null;
    }
  }

}