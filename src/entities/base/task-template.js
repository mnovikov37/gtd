/**
 * Абстрактный предок всех типов задач
 */
class TaskTemplate extends Item {
  static ITEM_TYPE = 'TASK';

  constructor(data) {
    super(data);
    // -- дополнение пользовательского интерфейса --
    this.ui.header.check = new E('div').addClass('task__check');                                      // -- головная часть : отметка о выполнении
      this.ui.header.check.completed = new E('input').set({ type : 'checkbox' })
        .addEventListener('change', (e) => {
          this.save();
        });
      this.ui.header.check.append(this.ui.header.check.completed);
    this.ui.header.iconNote = new E('div').addClass('task__note-icon').set({ textContent : '📝' }); // -- головная часть : иконка заметки
    this.ui.header.note = new E('textarea').addClass('task__note')                                  // -- головная часть : заметка
      .addEventListener('focus', () => { this.noteExpand() })
      .addEventListener('blur', () => { this.noteCollapse() });
    this.ui.header.append(this.ui.header.check, this.ui.header.iconNote, this.ui.header.note);
      
    this.ui.details.parent = new Field('Родитель').setField(new Select(true));                      // -- детали : родитель
    this.ui.details.append(this.ui.details.parent);

    this.noteCollapse();
  }

  completed() { return this.data.COMPLETED !== ""; }

  updateUI() {
    super.updateUI();
    this.ui.header.check.completed.set({ checked : this.completed() });
    if (this.completed()) {
      this.ui.header.title.addClass('item__header_checked');
    } else {
      this.ui.header.title.removeClass('item__header_checked');
    }
    this.ui.header.note.set({ value : this.data.NOTE});
  }

  mappingData() {
    super.mappingData();
    const checked = this.ui.header.check.completed.get('checked');
    if (checked) {
      if (!this.completed()) this.data.COMPLETED = nowWithMs();
    } else {
      this.data.COMPLETED = "";
    }
    this.dataExt.completed = checked;
    this.data.NOTE = this.ui.header.note.value().trim();
    this.data.PARENT = +this.ui.details.parent.value();
  }

  noteExpand() {
    this.ui.header.note.e.style.height = 'auto';
    this.ui.header.note.e.style.height = (this.ui.header.note.get('scrollHeight')) + 'px';
  }

  noteCollapse() {
    if (this.ui.details.get('hidden')) {
      if ( this.ui.header.note.get('value').trim() === '' ) {
        this.ui.header.note.set({ hidden : true });
        this.ui.header.iconNote.e.style.display = 'none';
      } else {
        this.ui.header.note.e.style.height = 'auto';
        this.ui.header.note.set({ rows : '1' });
      }
    }
  }

  detailsExpand() {
    super.detailsExpand();
    this.ui.header.note.set({ hidden : false });
    this.ui.header.iconNote.e.style.display = 'flex';
    this.noteExpand();
  }

  detailsCollapse() {
    super.detailsCollapse();
    this.noteCollapse();
  }

}