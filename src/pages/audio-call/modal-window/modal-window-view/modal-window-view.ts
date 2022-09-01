import './modal-window.css';
import { Stat } from '../../../../core/types/controller-types';
export default class ModalWindowView {
  renderModalWindow(statistic: Stat) {
    const main = document.querySelector('main') as HTMLElement;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const results = this.createResults(statistic);
    const option = this.createOptionBlock();
    modal.append(results, option);
    main.append(modal);
  }

  createResults(statistic: Stat) {
    const results = document.createElement('div');
    const keys = Object.keys(statistic);
    results.classList.add('results');
    for (let i = 0; i < keys.length; i += 1) {
      if (statistic[keys[i]].local === 1 && statistic[keys[i]].inThisGame) {
        const wordEn = statistic[keys[i]].option[0] as string;
        const translateWord = statistic[keys[i]].option[1] as string;
        results.append(this.createOneResult(wordEn, translateWord, 'symbol-true'));
      } else if (statistic[keys[i]].local === 0 && statistic[keys[i]].inThisGame) {
        const wordEn = statistic[keys[i]].option[0] as string;
        const translateWord = statistic[keys[i]].option[1] as string;
        results.append(this.createOneResult(wordEn, translateWord, 'symbol-false'));
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
  createOneResult(word: string, wordTranslate: string, symbolClass: string) {
    const result = document.createElement('div');
    result.classList.add('result');
    result.innerHTML = `
      <button class = "audio-result"></button>
      <span class = "word-en-result">${word}</span>
      <span class = "word-translate-result">${wordTranslate}</span>
      <div class = "result-symbol ${symbolClass}"></div>
    `;
    return result;
  }
}