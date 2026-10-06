class Loader {

  static data;

  static delete(element, id) {
    console.log(element);
    console.log(id);
    console.log(this.data[element]);
    const index = this.data[element].findIndex(item => item.ID === id);
    if (index !== -1) this.data[element].splice(index, 1);
  }

  constructor() {
    const msg = document.createElement('p');
    msg.textContent = 'Выбрать дамп:'
    document.body.appendChild(msg);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      this.parseJsonFile(file).then((data) => {
        this.constructor.data = data;
        Goal.set(data.GOAL);
        Folder.set(data.FOLDER);
        Context.set(data.CONTEXT);
        Priority.set(Priority.PRIORITIES);
        Project.set(data.TASK.filter(task => (task.TYPE == Project.TYPE)));
        ChecklistItem.set(data.TASK.filter(task => (task.TYPE == ChecklistItem.TYPE)));
        Checklist.set(data.TASK.filter(task => (task.TYPE == Checklist.TYPE)));
        Task.set(data.TASK.filter(task => (task.TYPE == Task.TYPE)));

        new UI();
      });
    });
    document.body.appendChild(input);
  }

  parseJsonFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonObject = JSON.parse(event.target.result);
          resolve(jsonObject); // Возвращаем готовый объект
        } catch (error) {
          reject(new Error('Неверный формат JSON-файла'));
        }
      };

      reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
      reader.readAsText(file);
    });
  }

}