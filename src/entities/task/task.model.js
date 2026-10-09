class Task extends TaskTemplate {
  static TYPE = 1; // Уникальный идентификатор типа "Задача"

  constructor(data) {
    super(data);
  }

  // Бизнес-логика получения связанных текстовых данных
  getFolderTitle() {
    const folder = Folder.get(this.data.FOLDER);
    return folder ? folder.data.TITLE : 'Без папки';
  }

  getProjectTitle() {
    const project = Project.get(this.data.PROJECT);
    return project ? project.data.TITLE : 'Без проекта';
  }

  getPriorityTitle() {
    const priority = Priority.get(this.data.PRIORITY);
    return priority ? priority.data.TITLE : 'Обычный';
  }

  getContextTitle() {
    const context = Context.get(this.data.CONTEXT);
    return context ? context.data.TITLE : 'Без контекста';
  }

  getDueDate() {
    return this.data.DUE_DATE || '';
  }
}