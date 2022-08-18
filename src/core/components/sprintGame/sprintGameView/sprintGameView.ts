export class SprintGameView {
  render() {
    this.resetMain();
    this.addContainersToMain();
  }
  resetMain() {
    const main = document.querySelector<HTMLElement>('main');
    if (main) {
      main.innerHTML = '';
    }
  }
  createSettingsSection() {
    const settingsSection = document.createElement('section');
    settingsSection.classList.add('settings-section')
    settingsSection.innerHTML = `
      <img src = '../../assets/with-sound.svg' alt="sound icon" class="sound-icon">
      <img src = '../../assets/fullscreen_icon.svg' alt="fullscreen icon" class="fullscreen-icon">
      <img src = '../../assets/close_icon.svg' alt="close icon" class="close-icon">
    `
    return settingsSection;
  }
  createCountSection() {
    const countSection = document.createElement('section');
    countSection.classList.add('count-section');
    countSection.innerHTML = `
      <span class="point-count">0</span>
      <div class="timer"></div>
    `
    return countSection;
  }
  createSprintGameContainer() {
    const sprintGameContainer = document.createElement('div');
    sprintGameContainer.classList.add('sprint-game-container');
    sprintGameContainer.innerHTML = `
      <div class="circles">
        <button class="circle circle-1"></button>
        <button class="circle circle-2"></button>
        <button class="circle circle-3"></button>
      </div>
      <div class="points-text">+10 очков за слово</div>
      <div class="human-img">
        <img src="../../assets/running_man.svg" alt="running man">
      </div>
      <div class="english-word">hello</div>
      <div class="russian-word">привет</div>
      <div class="ok-icon">
        <img src="ok_circle_icon" alt="ok-icon" class="ok-icon">
      </div>
      <div class="answers-button">
        <button class="wrong-answer-btn answer-btn" name="wrong-answer">Неверно</button>
        <button class="right-answer-btn answer-btn" name="right-answer">Верно</button>
      </div>
    `
    return sprintGameContainer;
  }
  addContainersToMain() {
    const main = document.querySelector<HTMLElement>('main');
    const sprintGameContainer = this.createSprintGameContainer();
    const createCountSection = this.createCountSection();
    const createSettingsSection = this.createSettingsSection();
    const fragment = document.createDocumentFragment();
    fragment.append(sprintGameContainer, createCountSection, createSettingsSection);
    if (main) {
      main.append(fragment);
    }
  }
}