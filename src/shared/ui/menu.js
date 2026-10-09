class Menu {

  current = '';
  ui;

  constructor(event, items, current = '') {
    this.ui = new E('div');

    this.current = current;
    /*
    items.forEach(item => {
      this.ui.append(new E('button').set({ textContent : item.text }).addEventListener('click', (e) => {
        if (this.current !== item.signal || item.repeat) {
          this.current = item.signal;
          const ev = new CustomEvent(event, {
            bubbles: true,
            detail: { signal: item.signal }
          });
          this.ui.dispatchEvent(ev);
        }
      }));
    });
    */
  }

}