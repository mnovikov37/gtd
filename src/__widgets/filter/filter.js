class Filter extends DOMElement {
  filter;
  event;

  constructor(event) {
    super();

    this.filter = {
      goal    : Select.OPTION_ANY__VALUE,
      project : Select.OPTION_ANY__VALUE,
      context : Select.OPTION_ANY__VALUE
    }

    this.event = event;

    this.ui.addClass('filter');
    this.ui.goal = new Field('Цель', new Select(true, true).addEventListener('change', (e) => {
      this.filter.goal = +e.target.value;
      this.change();
    }));
    this.ui.project = new Field('Проект', new Select(true, true).addEventListener('change', (e) => {
      this.filter.project = +e.target.value;
      this.change();
    }));
    this.ui.context = new Field('Контекст', new Select(true, true).addEventListener('change', (e) => {
      this.filter.context = +e.target.value;
      this.change();
    }));

    this.ui.append(this.ui.goal, this.ui.project, this.ui.context);
  }

  change() {
    const ev = new CustomEvent(this.event, { bubbles: true });
    this.ui.dispatchEvent(ev);
  }

  updateUI() {
    /*
    this.ui.goal.field.setOptions(Goal.selectOptions, this.filter.goal);
    this.ui.project.field.setOptions(Project.selectOptions, this.filter.project);
    this.ui.context.field.setOptions(Context.selectOptions, this.filter.context);
    */
  }
}