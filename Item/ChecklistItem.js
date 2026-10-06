class ChecklistItem extends TaskTemplate {
  static TYPE = 3;

  constructor(data) {
    super(data);
    // -- дополнение пользовательского интерфейса
    this.ui.header.check.addClass('task__check_type_list-item');
    this.ui.details.parent.setTitle('Чеклист')
  }

  updateUI() {
    super.updateUI()
    this.ui.details.parent.field.setOptions(Checklist.selectOptions, this.data.PARENT);
  }

}