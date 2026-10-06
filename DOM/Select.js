class Select extends E {
  /**
   * Структура опций:
   *  [
   *    { title: title1, value: value1 },
   *    { title: title2, value: value2, children: [
   *      { title: title2_1, value: value2_1 },
   *      ...
   *    ] },
   *    ...
   *  ]
   * 
   * Вложенность опций неограничена
   * Опция "Любой" - значение = ''
   * Опция "Никакой" - значение = 0
   */

  static PREFIX = '\u00A0\u00A0';
  static OPTION_ANY__TITLE = '- ЛЮБОЙ -';
  static OPTION_ANY__VALUE = -1;
  static OPTION_NO__TITLE = '- НЕТ -';
  static OPTION_NO__VALUE = 0;

  optionAny;
  optionNo;

  constructor(optionNo = false, optionAny = false) {
    super('select');

    this.optionNo = optionNo;
    this.optionAny = optionAny;
  }

  addOptions(options, prefix = '') {
    options.forEach(item => {
      this.append(new E('option').set({ textContent : `${prefix}${item.title}`, value : item.value }));
      if (Object.hasOwn(item, 'children')) {
        this.addOptions(item.children, `${prefix}${Select.PREFIX}`);
      }
    });
    return this;
  }

  setOptions(options, value = null) {
    this.replaceChildren();
    if (this.optionNo ) this.append(new E('option').set({ textContent :  Select.OPTION_NO__TITLE, value :  Select.OPTION_NO__VALUE }));
    if (this.optionAny) this.append(new E('option').set({ textContent : Select.OPTION_ANY__TITLE, value : Select.OPTION_ANY__VALUE }));
    this.addOptions(options);
    if (value) this.set({ value : value });
    return this;
  }

  setNoAny(optionNo = false, optionAny = false) {
    this.optionNo = optionNo;
    this.optionAny = optionAny;
    return this;
  }
}