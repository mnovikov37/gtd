class Goals extends DOMElement{
  updateUI() {
    Goal.poolHrc.forEach(goal => {
      this.ui.append(this.renderGoal(goal));
    });
  }

  renderGoal(goal) {
    const result = goal.render();
    goal.dataExt.children.forEach(child => {
      result.append(this.renderGoal(child));
    });
    return result;
  }

}