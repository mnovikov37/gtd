/**
 * Функционал, общий для всего кода проекта
 */

// Получение вложенного свойства объекта по его текстовому представлению: 'role.permissions.group.id'
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Фильтрует объект типа Map по нескольким условиям
 * Возвращает новый Map. Исходный Map не меняет
 * conditions: [
 *   { p : param1, v: value 1 },
 *   { p : param2, v: [value 2_1, value 2_2] },
 *   ...
 * ]
 * Если v - массив, то фильтрация параметра по условию "ИЛИ"
 * Разные параметры между собой фильтруюутся по условию "И"
 * Если надо фильтровать между собой разные параметры по условию "ИЛИ" - можно фильтровать отдельно и потом объединять результаты
 */
function filterMap(map, conditions) {
  let result = new Map(map);
  conditions.forEach(condition => {
    if (Array.isArray(condition.v)) {
      resCommon = new Map();
      condition.v.forEach(value => {
        res = new Map([...result].filter(([key, item]) => getNestedValue(item, condition.p) === value));
        res.forEach((value, key) => resCommon.set(key, value));
      });
      result = resCommon;
    } else {
      result = new Map([...result].filter(([key, item]) => getNestedValue(item, condition.p) === condition.v));
    }
  });
  return result;
}

/**
 * Возвращает настоящий момент времени в местном часовом поясе в формате "2024-12-09 18:49:21.798"
 */
function nowWithMs() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');  // Месяцы в JS идут от 0 до 11, поэтому добавляем 1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');  // Миллисекунды дополняем до 3 знаков

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}