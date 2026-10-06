class Task extends TaskTemplate {
  static TYPE = 0;

  constructor(data)  {
    super(data);
    // -- дополнение пользовательского интерфейса
    this.ui.details.type    = new Field('Тип',             new Select().addOptions([ { title : 'Задача', value : Task.TYPE }, { title : 'Чеклист', value : Checklist.TYPE } ]));
    this.ui.details.dueDate = new Field('Дата завершения', new E('input').set({ type  : 'date' }));
    this.ui.details.goal    = new Field('Цель',            new Select(true));
    this.ui.details.prepend(this.ui.details.type, this.ui.details.dueDate, this.ui.details.goal);

    this.ui.details.parent.setTitle('Проект');

    this.ui.details.folder   = new Field('Папка',     new Select(true));
    this.ui.details.context  = new Field('Контекст',  new Select(true));
    this.ui.details.priority = new Field('Приоритет', new Select().setOptions(Priority.selectOptions));
    this.ui.details.append(this.ui.details.folder, this.ui.details.context, this.ui.details.priority);
  }

  dueDate() { return this.data.DUE_DATE.slice(0, 10); }

  updateUI() {
    super.updateUI();
    this.ui.details.type.field.set({ value : this.constructor.TYPE });
    this.ui.details.dueDate.field.set({ value : this.dueDate() });
    this.ui.details.goal.field.setOptions(Goal.selectOptions, this.data.GOAL);
    this.ui.details.parent.field.setOptions(Project.selectOptions, this.data.PARENT);
    this.ui.details.folder.field.setOptions(Folder.selectOptions, this.data.FOLDER);
    this.ui.details.context.field.setOptions(Context.selectOptions, this.data.CONTEXT);
    this.ui.details.priority.field.set({ value: this.data.PRIORITY });
  }

  validate() {
    super.validate();
  }

  mappingData() {
    super.mappingData();
    if (+this.ui.details.type.value() == Checklist.TYPE) this.changeToChecklist();
    this.data.DUE_DATE = this.ui.details.dueDate.value();
    if (this.data.DUE_DATE !== "" ) this.data.DUE_DATE += " 00:00";
    this.data.GOAL     = +this.ui.details.goal.value();
    this.data.PARENT   = +this.ui.details.parent.value();
    this.data.FOLDER   = +this.ui.details.folder.value();
    this.data.CONTEXT  = +this.ui.details.context.value();
    this.data.PRIORITY = +this.ui.details.priority.value();
  }

  changeToChecklist() {
    this.constructor.delete(this.data.ID);
    Checklist.add(this.data);
  }

}