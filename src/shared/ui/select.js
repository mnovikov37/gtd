/**
 * ----------------------------------------
 * Обычный селект + в конструкторе можно задать:
 * - набор пунктов. Если не задан, то будут только пункты "любой" и "нет" (и то если заданы. См. ниже)
 *    Набор пунктов принимает в виде такого массива:
 *    [
 *      { text: "отображаемый текст пункта1", value: значение пункта },
 *      { text: "отображаемый текст пункта2", value: значение пункта2 }
 *      ...
 *    ]
 * - будет ли пункт "нет". По умолчанию не будет. Всегда размещается первым пунктом в списке
 * - будет ли пункт "любой". По умолчанию не будет. Размещается в списке:
 *  - если есть пункт "нет" - вторым по очереди после пункта "нет"
 *  - если нет пункта "нет" - первым
 * ----------------------------------------
 * Что может:
 *  - setOptions(options) - заменить все пункты, кроме "любой" и "нет", на новый набор пунктов
 *  - setValue(value)     - установить выбранную величину. Если value = null - выбирается пункт "нет"
 *    если в списке пунктов нет пункта со значением value - выбросит исключение
 */
class Select extends HTMLSelectElement {
  // Префикс для пунктов, которые являются подпунктами
  // Нужен, чтобы выстраивать иерархические пункты в виде дерева
  static PREFIX = '\u00A0\u00A0';
  // Специализированные пункты "любой" и "нет"
  static OPTION_ANY__TEXT   = '- ЛЮБОЙ -';
  static OPTION_ANY__VALUE  = -1;
  static OPTION_NO__TEXT    = '- НЕТ -';
  static OPTION_NO__VALUE   = 0;

  optionAny;  // Признак, что имеется пункт "любой"
  optionNo;   // Признак, что имеется пункт "нет"

  constructor(options = [], value= null, optionNo = false, optionAny = false) {
    super();
    this.optionNo = optionNo;
    this.optionAny = optionAny;
    this.setOptions(options);
    this.setValue(value);
  }

  setOptions(options) {
    this.innerHTML = '';
    if (this.optionNo ) this.options.add(new Option(Select.OPTION_NO__TEXT, Select.OPTION_NO__VALUE));
    if (this.optionAny) this.options.add(new Option(Select.OPTION_ANY__TEXT, Select.OPTION_ANY__VALUE));
    options.forEach(option => (this.options.add(new Option(option.text, option.value))));
  }

  setValue(value) {
    this.value = value === null ? Select.OPTION_NO__VALUE : value;
    if (this.selectedIndex === -1) {
      throw new RangeError(`Can't set selected value = [${value}]: value does not exist in the options list`);
    }
  }
}

customElements.define('my-select', Select, { extends: 'select' });