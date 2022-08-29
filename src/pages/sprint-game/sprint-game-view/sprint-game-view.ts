import './sprint-game.css';
import './level-page.css';
import { Timer } from '../timer/timer';

export class SprintGameView {
  timer: Timer
  constructor() {
    this.timer = new Timer();
  }
  public render(englishWord: string, russianWord: string) {
    this.resetMain();
    this.addContainersToMain(englishWord, russianWord);
    this.timer.start();
  }
  public resetMain() {
    const main = document.querySelector<HTMLElement>('main');
    if (main) {
      main.innerHTML = '';
    }
  }
  private createSettingsSection() {
    const settingsSection = document.createElement('section');
    settingsSection.classList.add('settings-section')
    settingsSection.innerHTML = `
      <div class="sound-icon active"></div>
      <img src = './assets/svg/fullscreen_icon.svg' alt="fullscreen icon" class="fullscreen-icon">
      <img src = './assets/svg/close_icon.svg' alt="close icon" class="close-icon">
    `
    return settingsSection;
  }
  private createCountSection() {
    const countSection = document.createElement('section');
    countSection.classList.add('count-section');
    countSection.innerHTML = `
      <span class="point-count">0</span>
      <div class="timer"></div>
    `
    return countSection;
  }
  private createSprintGameContainer(englishWord: string, russianWord: string) {
    const sprintGameContainer = document.createElement('div');
    sprintGameContainer.classList.add('sprint-game-container');
    sprintGameContainer.innerHTML = `
      <div class="circles">
        <button class="circle circle-1"></button>
        <button class="circle circle-2"></button>
        <button class="circle circle-3"></button>
      </div>
      <div class="points-text">+<span class="point-count-text">10</span> очков за слово</div>
      <div class="human-img">
        <img src="./assets/svg/running_man.svg" alt="running man" class="running-man">
      </div>
      <div class="english-word">${englishWord}</div>
      <div class="russian-word">${russianWord}</div>
      <div class="ok-icon">
        
      </div>
      <div class="answers-button">
        <button class="wrong-answer-btn answer-btn" name="wrong-answer">Неверно</button>
        <button class="right-answer-btn answer-btn" name="right-answer">Верно</button>
      </div>
    `
    return sprintGameContainer;
  }
  private addContainersToMain(englishWord: string, russianWord: string) {
    const main = document.querySelector('main') as HTMLElement;
    const sprintGameContainer = this.createSprintGameContainer(englishWord, russianWord);
    const createCountSection = this.createCountSection();
    const createSettingsSection = this.createSettingsSection();
    const wrapper = document.createElement('div');
    wrapper.classList.add('game-wrapper');
    const fragment = document.createDocumentFragment();
    fragment.append(createSettingsSection, createCountSection, sprintGameContainer);
    wrapper.append(fragment);
    main.append(wrapper);
  }

  public clickOnTheAnswerButton(newEnglishWord: string, newRussianWord: string) {
    const englishWord = document.querySelector('.english-word') as HTMLDivElement;
    const rusWord = document.querySelector('.russian-word') as HTMLDivElement;
    englishWord.innerText = '';
    englishWord.innerText = newEnglishWord;
    rusWord.innerText = '';
    rusWord.innerText = newRussianWord;
  }

  public changeOkRightIcon() {
    const okIcon = document.querySelector('.ok-icon') as HTMLDivElement;
    okIcon.style.backgroundImage = 'url(assets/svg/ok_right_icon.svg)';
  }

  public changeBorderOfContainer() {
    const gameContainer = document.querySelector('.sprint-game-container') as HTMLDivElement;
    gameContainer.style.border =  '3px solid red';
  }
}