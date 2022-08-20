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
        this.page = this.getParam('page') || 0;
        this.group = this.getParam('group') || 0;
    }

    getParam(param: 'page' | 'group'): number {
        if (this[param] === null) {
            this.store.set(param, 0);
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
        const prevPageButton = document.querySelector('.page__controls-prev') as HTMLElement;
        const nextPageButton = document.querySelector('.page__controls-next') as HTMLElement;
        const prevGroupButton = document.querySelector('.group__controls-prev') as HTMLElement;
        const nextGroupButton = document.querySelector('.group__controls-next') as HTMLElement;
        if (this.page === 0) {
            prevPageButton.setAttribute('disabled', 'true');
        } else {
            prevPageButton.removeAttribute('disabled');
        }
        if (this.page === 29) {
            nextPageButton.setAttribute('disabled', 'true');
        } else {
            nextPageButton.removeAttribute('disabled');
        }
        prevPageButton.addEventListener('click', () => {
            this.page -= 1;
            this.store.set('page', this.page);
            this.render();
        })
        nextPageButton.addEventListener('click', () => {
            this.page += 1;
            this.store.set('page', this.page);
            this.render();
        })

        if (this.group === 0) {
            prevGroupButton.setAttribute('disabled', 'true');
        } else {
            prevGroupButton.removeAttribute('disabled');
        }
        if (this.group === 5) {
            nextGroupButton.setAttribute('disabled', 'true');
        } else {
            nextGroupButton.removeAttribute('disabled');
        }
        prevGroupButton.addEventListener('click', () => {
            this.group -= 1;
            this.store.set('group', this.group);
            this.render();
        })
        nextGroupButton.addEventListener('click', () => {
            this.group += 1;
            this.store.set('group', this.group);
            this.render();
        })

    }

    render() {
        this.getParam('page');
        this.getParam('group');
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <p>Страница ${this.page} Группа ${this.group}</p>
        <div class="page__controls">
            <button class="page__controls-prev">Prev page</button>
            <button class="page__controls-next">Next page</button>
            <button class="group__controls-prev">Prev group</button>
            <button class="group__controls-next">Next group</button>
        </div>`;
        this.turnOnControls();
        const cards = document.createElement('div');
        cards.classList.add('cards__container')
        this.controller.getWords(this.page, this.group).then(value => value.forEach((item: Word) => {
            cards.append(this.drawCard(item));
        }));
        app.append(cards);
    }
}