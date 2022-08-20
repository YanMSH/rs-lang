import './wordlist-page.css';
import Controller from "../../core/components/controller/controller";
import { Word } from "../../core/types/controller-types";
import Storage from '../../core/components/service/storage/storage';

export default class WordListPage {
    controller: Controller;
    store: Storage;
    page: number;
    group: number;
    constructor() {
        this.controller = new Controller();
        this.store = new Storage();
        this.page = this.getParam('page');
        this.group = this.getParam('group');
    }

    getParam(param: 'page' | 'group'): number {
        if (this[param] === null) {
            this.store.set(param, '0');
        }
        return this.store.get(param) as number;
    }


    drawCard(word: Word) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <img src="https://rs-back.herokuapp.com/${word.image}" class="word__pic">
        <p class="word"><span>${word.word}</span>: <span>${word.transcription}</span>, <span>${word.wordTranslate}</span></p>
        <p class="word__meaning"><span>${word.textMeaning}</span>: <span>${word.textMeaningTranslate}</span></p>
        <p class="word__example"><span>${word.textExample}</span>: <span>${word.textExampleTranslate}</span></p>`;
        return card;
    }

    turnOnControls() {
        const prevButton = document.querySelector('.page__controls-prev') as HTMLElement;
        const nextButton = document.querySelector('.page__controls-next') as HTMLElement;
        if (this.page === 0) {
            prevButton.setAttribute('disabled', 'true');
        } else {
            prevButton.removeAttribute('disabled');
        }
        if (this.page === 29) {
            nextButton.setAttribute('disabled', 'true');
        } else {
            nextButton.removeAttribute('disabled');
        }
    }

    render() {
        this.getParam('page');
        this.getParam('group');
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <div class="page__controls">
            <button class="page__controls-prev">Prev page</button>
            <button class="page__controls-prev">Next page</button>
        </div>`;
        const cards = document.createElement('div');
        cards.classList.add('cards__container')
        this.controller.getWords(this.page, this.group).then(value => value.forEach((item: Word) => {
            cards.append(this.drawCard(item));
        }));
        app.append(cards);
    }
}