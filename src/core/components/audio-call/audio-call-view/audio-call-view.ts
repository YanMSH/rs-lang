import './audio-call-view.css';

export default class AudioCallView {

  renderMainPage() {
    const main = document.querySelector('main') as HTMLElement;
    main.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const headerPanel = this.compareHeaderPanel();
    const mainPanel = this.compareGamePanel();
    wrapper.append(headerPanel, mainPanel);
    main.append(wrapper);
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
  
  createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    return heart;
  }
  welcomeMessage() {
    const message = document.createElement('span');
    message.classList.add('message');
    message.innerText = `
    Аудирование для многих, пожалуй, самый сложный навык. Понять иностранную речь бывает очень трудно: половину слов ты не успеваешь расслышать и понять. Из-за этого теряется смысл высказывания в целом. Особенно, если это телефонный разговор, или у тебя нет контекста события.
    `;
    return message;
  }
  
  renderOneButtons(count: number) {
    const level = document.createElement('button');
    level.classList.add('level');
    level.innerText = `${count}`;
    return level;
  }

  renderLevelButtons() {
    const levelButtons = document.createElement('div');
    levelButtons.classList.add('level-buttons');
    const maxLevel = 6;
    for (let i = 1; i < maxLevel; i += 1) {
      const button = this.renderOneButtons(i);
      levelButtons.append(button);
    }
    return levelButtons;
  }
  
  renderLevelPage() {
    const main = document.querySelector('main') as HTMLElement;
    main.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.classList.add('level-block');
    const message = this.welcomeMessage();
    const buttons = this.renderLevelButtons();
    wrapper.append(message, buttons);
    console.log('LevelPage');
    main.append(wrapper);
  }
}
