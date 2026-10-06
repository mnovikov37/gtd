class Projects extends DOMElement{
  updateUI() {
    Project.poolHrc.forEach(project => {
      this.ui.append(this.renderProject(project));
    });
  }

  renderProject(project) {
    const result = project.render();
    project.dataExt.children.forEach(child => {
      result.append(this.renderProject(child));
    });
    return result;
  }

}