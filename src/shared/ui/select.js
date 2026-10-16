/**
 * ----------------------------------------
 * Обычный селект + можно задать:
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
 *  - set OptionList(options) - заменить все пункты, кроме "любой" и "нет", на новый набор пунктов
 *  - setValue(value)         - установить выбранную величину. Если value = null - выбирается пункт "нет"
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

  _optionAny = undefined;  // Признак, что имеется пункт "любой"
  _optionNo = undefined;   // Признак, что имеется пункт "нет"
  _optionList = undefined;    // Пункты
  _initialValue = undefined;

  set optionNo(optionNo) {
    if (this._optionNo !== undefined) {
      throw new Error('optionNo can only be assigned once');
    }
    this._optionNo = optionNo;
  }

  set optionAny(optionAny) {
    if (this._optionAny !== undefined) {
      throw new Error('optionAny can only be assigned once');
    }
    this._optionAny = optionAny;
  }

  set optionList(optionList) {
    if (this._optionList !== undefined) {
      throw new Error('optionList can only be assigned once');
    }
    this._optionList = optionList;
  }

  set value(v) {
    if (this._initialValue !== undefined) {
      throw new Error('value can only be assigned once');
    }
    this._initialValue = v === null ? Select.OPTION_NO__VALUE : v;
  }

  connectedCallback() {
    this.replaceChildren();
    if (this._optionNo ) this.options.add(new Option(Select.OPTION_NO__TEXT, Select.OPTION_NO__VALUE));
    if (this._optionAny) this.options.add(new Option(Select.OPTION_ANY__TEXT, Select.OPTION_ANY__VALUE));
    this._optionList.forEach(option => (this.options.add(new Option(option.text, option.value))));
    if (this._initialValue !== undefined) {
      super.value = this._initialValue;
      if (this.selectedIndex === -1) {
        throw new RangeError(`Can't set selected value = [${this._initialValue}]: value does not exist in the options list`);
      }
    }
  }

}

customElements.define('my-select', Select, { extends: 'select' });