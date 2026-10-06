class UI {
  static MAIN_MENU__EVENT             = 'MAIN_MENU_CLICK';

  static MAIN_MENU__SIGNAL__ADD_TASK  = 'ADD_TASK';
  static MAIN_MENU__SIGNAL__KANBAN    = 'KANBAN';
  static MAIN_MENU__SIGNAL__GOALS     = 'GOALS';
  static MAIN_MENU__SIGNAL__PROJECTS  = 'PROJECTS';
  static MAIN_MENU__SIGNAL__DUMP      = 'DUMP';
  
  body;
  menu;
  content;

  constructor() {
    this.body = new E(document.body);
    this.body.clear();
    
    this.menu = new Menu(UI.MAIN_MENU__EVENT, [
      {text: '+'      , signal: UI.MAIN_MENU__SIGNAL__ADD_TASK, repeat: true },
      {text: 'Канбан' , signal: UI.MAIN_MENU__SIGNAL__KANBAN   },
      {text: 'Цели'   , signal: UI.MAIN_MENU__SIGNAL__GOALS    },
      {text: 'Проекты', signal: UI.MAIN_MENU__SIGNAL__PROJECTS },
      {text: 'Дамп'   , signal: UI.MAIN_MENU__SIGNAL__DUMP     }
    ], UI.MAIN_MENU__SIGNAL__KANBAN);
    this.content = new Kanban();
    
    this.body.append(this.menu.ui, this.content.render());

    this.body.addEventListener(UI.MAIN_MENU__EVENT, (event) => {
      this.mainMenuClick(event);
    });

    this.body.addEventListener(Item.EVENT__SAVE, (e) => {
      this.setContent(this.content);
    });

  }

  mainMenuClick(event) {
      switch(event.detail.signal) {
        case UI.MAIN_MENU__SIGNAL__ADD_TASK:
          if (!this.isAddTask) {
            this.body.append(new AddTask().render());
          }
          break;
        case UI.MAIN_MENU__SIGNAL__KANBAN:
          this.setContent(new Kanban());
          break;
        case UI.MAIN_MENU__SIGNAL__GOALS:
          this.setContent(new Goals());
          break;
        case UI.MAIN_MENU__SIGNAL__PROJECTS:
          this.setContent(new Projects());
          break;
        case UI.MAIN_MENU__SIGNAL__DUMP:
          this.setContent(new Dump());
          break;
      }
  }

  setContent(element) {
    this.content.remove();
    this.content = element;
    const contentUI = this.content.render();
    this.body.append(contentUI);
  }

}