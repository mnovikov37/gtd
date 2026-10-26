class Kanban extends Node {

  view = 'kanban-view';
  #projectId = Select.OPTION_ANY__VALUE;

  get titles() {
    return KANBAN__FOLDERS.map(folder => folder.TITLE);
  }

  get data() {
    const data = [];

    const rootProjects = [];

    if (this.#projectId != Select.OPTION_NO__VALUE && this.#projectId != Select.OPTION_ANY__VALUE) {
      const rootProject = Task.get(this.#projectId);
      if (rootProject.data.TYPE != 1) {
        throw new TypeError(`Task "${rootProject.data.TITLE}" is not a Project`);
      }
      rootProjects.push(rootProject);
    }

    if (this.#projectId === Select.OPTION_NO__VALUE) {
      rootProjects.push({ data: { ID: this.#projectId, TITLE: 'Без проекта' }, children: [] });
    }

    if (this.#projectId === Select.OPTION_ANY__VALUE) {
      rootProjects.push({ data: { ID: this.#projectId, TITLE: 'Все проекты' }, children: [] });
      rootProjects.push(...Task.filter([ { p: 'data.PARENT', v: Select.OPTION_NO__VALUE }, { p: 'data.TYPE', v: 1 } ]).values());
    }

    rootProjects.forEach(project => {
      data.push(...this.#getProject(project));
    });
    data.push(...this.#getNotebooks());

    return data;
  }

  #getProject(project, prefix = '') {
    const result = [{
      ID: project.data.ID,
      TITLE: prefix + '\u00A0' + project.data.TITLE,
      FOLDERS: this.#getFolders(project.data.ID)
    }]
    project.children.forEach(child => {
      if (child.data.TYPE === TaskType.TASK_TYPE__PROJECT) {
        result.push(...this.#getProject(child, prefix + '\u00A0-\u00A0-'));
      }
    });
    return result;
  }

  #getFolders(projectId) {
    const folders = [];
    KANBAN__FOLDERS.forEach(folder => {
      folders.push(this.#getTasks(folder.ID, projectId));
    })
    return folders;
  }

  #getTasks(folderId, projectId) {
    const filterTasks = [ { p: 'data.FOLDER', v: folderId }, { p: 'data.TYPE', v: [0, 2] }, { p: 'data.PARENT', v: projectId } ];
    const tasks = Array.from(Task.filter(filterTasks).values());
    tasks.sort((a, b) => {
      return ((b.data.COMPLETED !== "") - (a.data.COMPLETED !== ""))
      || ((a.data.DUE_DATE === "") - (b.data.DUE_DATE === ""))
      || (a.data.DUE_DATE.localeCompare(b.data.DUE_DATE)
      || (a.data.TITLE.localeCompare(b.data.TITLE)));
    })
    return tasks;
  }

  #getNotebooks() {
    const folders = [];
    KANBAN__FOLDERS.forEach(folder => {
      const notebooks = Array.from(Notebook.filter([{ p: 'data.FOLDER_ID', v: folder.ID }]).values());
      notebooks.sort((a, b) => { return (a.data.TITLE.localeCompare(b.data.TITLE)); })
      folders.push(notebooks);
    });
    return [{
      ID: 0,
      TITLE: "\u00A0Заметки (не имеют проекта)",
      FOLDERS: folders
    }]
  }

  set projectId(id) {
    this.#projectId = id;
  }

}