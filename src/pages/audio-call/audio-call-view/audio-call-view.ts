import './audio-call-view.css';
import { Word } from '../../../core/types/controller-types';
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
    this.addHeart();
  }

  createResponseOptions() {
    const responseOptions = document.createElement('div');
    responseOptions.classList.add('response-options');
    responseOptions.innerHTML = `
      <button class = "word first-word"></button>
      <button class = "word second-word"></button>
      <button class = "word third-word"></button>
      <button class = "word fourth-word"></button>
      <button class = "word fifth-word"></button>
    `;

    return responseOptions;
  }

  refreshResponse(array: Word[]) {
    const statusMessage = document.querySelectorAll('status');
    statusMessage.forEach((elem) => {
      elem.remove();
    });
    const options = document.querySelector('.response-options') as HTMLElement;
    if (options) {
      options.innerHTML = '';
      options.innerHTML = `
        <button class = "word first-word">${array[0].wordTranslate}</button>
        <button class = "word second-word">${array[1].wordTranslate}</button>
        <button class = "word third-word">${array[2].wordTranslate}</button>
        <button class = "word fourth-word">${array[3].wordTranslate}</button>
        <button class = "word fifth-word">${array[4].wordTranslate}</button>
      `
    }
  }

  createPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');
    controlPanel.innerHTML = `
      <div class = "control-fullscreen" data-toggle-fullscreen></div>
      <div class = "close-game"></div>
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
    headerPanel.append(lifeCounter, controlPanel);
    
    return headerPanel;
  }
  createKeyWord() {
    const keyWord = document.createElement('span');
    keyWord.classList.add('key-word');
    keyWord.classList.add('none');
    keyWord.innerText = 'Initial word';
    
    return keyWord;
  }
  refreshKeyWord(rightWord: string, rightWordEn: string) {
    const keyWord = document.querySelector('.key-word') as HTMLSpanElement;
    keyWord.classList.add('none');
    keyWord.setAttribute('data-ru', rightWordEn);
    keyWord.innerText = `${rightWord}`;
  }
  compareGamePanel() {
    const gamePanel = document.createElement('div');
    gamePanel.classList.add('game-panel');
    const responseOptions = this.createResponseOptions();
    const audioButton = document.createElement('button');
    audioButton.classList.add('audio-button');
    const keyWord = this.createKeyWord();
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
  addHeart(maxLife = 5) {
    for (let i = 1; i <= maxLife; i += 1) {
      const heart = this.createHeart();
      const lifeCounter = document.querySelector('.life-counter') as HTMLDivElement;
      lifeCounter.append(heart);
    }
  }
  removeHearth(): number {
    const lifeCounter = document.querySelector('.life-counter') as HTMLDivElement;
    const heart = document.querySelectorAll('.heart') as NodeList;
    if (heart.length !== 0) {
      const removeHeart = heart[0]; 
      lifeCounter.removeChild(removeHeart);
    } 
    return heart.length;
  }
}
