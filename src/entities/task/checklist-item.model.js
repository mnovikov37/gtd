class ChecklistItem extends TaskTemplate {
  static TYPE = 3; // Тип сущности внутри дампа задач

  constructor(data) {
    super(data);
  }

  // Получить название родительского чеклиста для вывода в деталях
  getChecklistTitle() {
    // Ищем родительский чеклист в пуле моделей ChecklistModel
    const parentChecklist = ChecklistModel.get(this.data.PARENT);
    return parentChecklist ? parentChecklist.data.TITLE : 'Без чеклиста';
  }
}