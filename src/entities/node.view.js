const withNodeView = (BaseClass = HTMLElement) => { // Базовая логика всех UI-элементов
  return class extends BaseClass {
    #model = null; // Ссылка на связанную модель данных
    #isInitialized = false; // Флаг, чтобы избежать повторного рендера при перемещении в DOM
  
    init(model) {
      if (this.#model) {
        throw new TypeError('Reinitialization is prohibited');
      }
      this.#model = model;
      // Если элемент уже был добавлен в DOM до вызова init, запускаем рендер
      if (this.isConnected && !this.#isInitialized) {
        this.render();
      }
    }

    get model() {
      return this.#model;
    }

    connectedCallback() {
      // Рендерим только если есть модель и элемент еще не был инициализирован
      if (this.#model && !this.#isInitialized) {
        this.render();
      }
    }

    render() {
      if (!this.#model) {
        throw new Error('Cannot render without model');
      }

      this.#isInitialized = true;
      this.replaceChildren();
    }

  }
}