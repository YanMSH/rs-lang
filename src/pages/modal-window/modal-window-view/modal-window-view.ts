import './modal-window.css';
import { Stat } from '../../../core/types/controller-types';
export default class ModalWindowView {
  createModalWindow(statistic: Stat, messageText: string) {
    const main = document.querySelector('main') as HTMLElement;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const message = this.createMessage(messageText);
    const results = this.createResults(statistic);
    const option = this.createOptionBlock();
    modal.append(message, results, option);
    main.append(modal);
  }
  createMessage(messageText: string) {
    const text = document.createElement('span');
    text.classList.add('modal-message');
    text.innerText = messageText;
    return text;
  }
  createResults(statistic: Stat) {
    const results = document.createElement('div');
    const keys = Object.keys(statistic);
    results.classList.add('results');
    for (let i = 0; i < keys.length; i += 1) {
      if (statistic[keys[i]].local === 1 && statistic[keys[i]].inThisGame) {
        const classButton = keys[i];
        const wordEn = statistic[keys[i]].option[0] as string;
        const translateWord = statistic[keys[i]].option[1] as string;
        results.append(this.createOneResult(wordEn, translateWord, 'symbol-true', classButton));
      } else if (statistic[keys[i]].local === 0 && statistic[keys[i]].inThisGame) {
        const classButton = keys[i];
        const wordEn = statistic[keys[i]].option[0] as string;
        const translateWord = statistic[keys[i]].option[1] as string;
        results.append(this.createOneResult(wordEn, translateWord, 'symbol-false', classButton));
      }
    }
    return results;
  }
  createOptionBlock() {
    const option = document.createElement('div');
    option.classList.add('options');
    option.innerHTML = `
      <button class = "refresh">Продолжить изучение</button>
      <button class = "textbook">Учебник</button>
    `;
    return option;
  }
  createOneResult(word: string, wordTranslate: string, symbolClass: string, classButton: string) {
    const result = document.createElement('div');
    result.classList.add('result');
    result.innerHTML = `
      <button class = "audio-result ${classButton}"></button>
      <span class = "word-en-result">${word}</span>
      <span class = "word-translate-result">${wordTranslate}</span>
      <div class = "result-symbol ${symbolClass}"></div>
    `;
    return result;
  }
}
