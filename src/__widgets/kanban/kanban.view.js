class KanbanView extends withNodeView(HTMLDivElement) {

  render() {
    super.render();
    this.classList.add('kanban');

    const content = document.createElement('div');
    content.classList.add('kanban__content');

    this.model.data.forEach(project => {
      content.append(this.#renderProject(project));
    });

    this.append(this.#renderTitles(this.model.titles), content);
  }

  #renderTitles(titles) {
    const titlesUi = document.createElement('div');
    titlesUi.classList.add('kanban__folders');
    titles.forEach(t => {
      const titleUi = document.createElement('p');
      titleUi.classList.add('kanban__folder-title');
      titleUi.textContent = t;
      titlesUi.append(titleUi);
    });
    return titlesUi;
  }

  #renderProject(data) {
    const project = document.createElement('div');
    const title = document.createElement('p');
    title.classList.add('kanban__project-title');
    title.textContent = data.TITLE;
    project.append(title, this.#renderFolders(data.FOLDERS));
    return project;
  }

  #renderFolders(data) {
    //console.log(data);
    const folders = document.createElement('div');
    folders.classList.add('kanban__folders');

    data.forEach(folder => {
      folders.append(this.#renderFolder(folder));
    });
    return folders;
  }

  #renderFolder(data) {
    const folder = document.createElement('div');
    let currentDate = "ABC";
    data.forEach(task => {
      const dueDate = task.data.DUE_DATE ? task.data.DUE_DATE : "";
      if (dueDate !== currentDate) {
        const date = document.createElement('p');
        date.textContent = dueDate ? dueDate : "Без даты"
        folder.append(date);
        currentDate = dueDate;
      }
      folder.append(task.ui);
    });
    return folder;
  }

}

customElements.define('kanban-view', KanbanView, { extends: 'div' });