/**
 * Какой-то элемент пользовательского интерфейса. По умолчанию блок
 */
class DOMElement {
  ui;

  constructor() {
    this.ui = new E('div'); // "Каркас" пользовательского интерфейса - неизменяемая часть
  }

  updateUI() { // Здесь то, что должно обновляться в UI: либо при каждой отрисовке, либо по команде извне
    this.ui.set({ textContent : "[DOMElement]" });
  }

  render() {
    this.updateUI();
    return this.ui;
  }

  remove() {
    this.ui.remove();
  }

  // Диагностическая функция
  dump() {
    console.log( this.ui.e.outerHTML);
  }
}