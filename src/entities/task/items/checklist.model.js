class Checklist extends TaskTemplate {
  static TYPE = 3; // Уникальный идентификатор типа "Чеклист"

  constructor(data) {
    super(data);
  }

  // Получить все дочерние пункты этого чеклиста, отсортированные по ID
  getChildren() {
    const conditions = [{ p: 'data.PARENT', v: this.data.ID }];
    return [...ChecklistItem.filter(conditions).values()].sort((a, b) => a.data.ID - b.data.ID);
  }
}