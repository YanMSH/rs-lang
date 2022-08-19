import './audioCallView.css';

export default class AudioCallView {

  renderMainPage() {
    const main = document.querySelector<HTMLElement>('main');
    if (main) {
      main.innerHTML = '';
    }
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const headerPanel = this.compareHeaderPanel();
    const mainPanel = this.compareGamePanel();
    wrapper.append(headerPanel, mainPanel);
    main?.append(wrapper);
  }

  createResponseOptions() {
    const responseOptions = document.createElement('div');
    responseOptions.classList.add('response-options');
    responseOptions.innerHTML = `
      <button class = "word first-word">1. любовь </button>
      <button class = "word second-word">2. семья </button>
      <button class = "word third-word">3. брат </button>
      <button class = "word fourth-word">4. природа </button>
      <button class = "word fifth-word">5. волк </button>
    `;

    return responseOptions;
  }

  createPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');
    controlPanel.innerHTML = `
      <div class = "sound-control"></div>
      <div class = "control-fullscreen"></div>
    `;
    
    return controlPanel;
  }

  lifeCounter() {
    const lifeCounter = document.createElement('div');
    lifeCounter.classList.add('life-counter');

    return lifeCounter;
  }

  compareHeaderPanel() {
    const headerPanel = document.createElement('div');
    headerPanel.classList.add('header-panel');
    const controlPanel = this.createPanel();
    const lifeCounter = this.lifeCounter();
    headerPanel.append(controlPanel, lifeCounter);
    
    return headerPanel;
  }

  compareGamePanel() {
    const gamePanel = document.createElement('div');
    gamePanel.classList.add('game-panel');
    const responseOptions = this.createResponseOptions();
    const audioButton = document.createElement('button');
    audioButton.classList.add('audio-button');
    const keyWord = document.createElement('span');
    keyWord.classList.add('key-word');
    keyWord.innerText = 'family';
    const negationButton = document.createElement('button');
    negationButton.classList.add('negation-button');
    negationButton.innerText = "Не знаю";
    gamePanel.append(audioButton, keyWord, responseOptions, negationButton);

    return gamePanel;
  }
  createHearth() {
    const hearth = document.createElement('div');
    hearth.classList.add('hearth');
    return hearth;
  }
}
