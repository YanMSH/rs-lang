import './textbook-page.css';
import Controller from '../../core/components/controller/controller';
import { Word } from '../../core/types/controller-types';
import Storage from '../../core/components/service/storage/storage';
import TextbookController from './textbook-controller';
import { AWPaginatedResults } from '../../core/types/loader-types';

export default class TextbookPage {
    tbController: TextbookController;
    controller: Controller;
    store: Storage;
    page: number;
    group: number;
    constructor() {
        this.tbController = new TextbookController();
        this.controller = new Controller();
        this.store = new Storage();
        this.page = this.getParam('page') || 0;
        this.group = this.getParam('group') || 0;
    }

    private getParam(param: 'page' | 'group'): number {
        if (this[param] === null) {
            this.store.set(param, 0);
        }
        return this.store.get(param) as number;
    }

    private turnOnPlayButton(card: HTMLElement) {
        const audioPlayButton = card.querySelector('.word__audio-play') as HTMLButtonElement;
        const audio = card.querySelector('.word__audio') as HTMLAudioElement;
        const audioMeaning = card.querySelector('.word__audio-meaning') as HTMLAudioElement;
        const audioExample = card.querySelector('.word__audio-example') as HTMLAudioElement;

        audioPlayButton.addEventListener('click', () => audio.play());
        audio.addEventListener('ended', () => audioMeaning.play());
        audioMeaning.addEventListener('ended', () => audioExample.play());
    }

    private turnOnHardLearnedButtons(card: HTMLElement, id: string) {
        const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
        setHardButton.onclick = () => {
            card.classList.toggle('card__word-hard');
            if (setHardButton.innerText === 'Сложно') {
                setHardButton.innerText = 'Не сложно';
            } else {
                setHardButton.innerText = 'Сложно';
            }
            this.tbController.postHardWord(id as string);
        };
        const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
        setLearnedButton.onclick = () => {
            card.classList.toggle('card__word-learned');
            if (setLearnedButton.innerText === 'Изучил') {
                setLearnedButton.innerText = 'Забыл';
            } else {
                setLearnedButton.innerText = 'Изучил';
            }
            this.tbController.postLearnedWord(id as string);
        };
    }

    private drawCard(word: Word) {
        const card = document.createElement('div');
        card.dataset.id = word.id ? word.id : word._id;
        card.classList.add('card');

        card.innerHTML = `
        <img src="https://rs-back.herokuapp.com/${word.image}" class="word__pic">
        <p class="word__word"><span>${word.word}</span>: <span>${word.transcription}</span>, <span>${word.wordTranslate}</span></p>
        <p class="word__meaning"><span>${word.textMeaning}</span>: <span>${word.textMeaningTranslate}</span></p>
        <p class="word__example"><span>${word.textExample}</span>: <span>${word.textExampleTranslate}</span></p>
        <audio class="word__audio" src="https://rs-back.herokuapp.com/${word.audio}"></audio>
        <audio class="word__audio-meaning" src="https://rs-back.herokuapp.com/${word.audioMeaning}"></audio>
        <audio class="word__audio-example" src="https://rs-back.herokuapp.com/${word.audioExample}"></audio>
        <button class="word__audio-play">Play</button>
        <div class="auth__visible">
            <button class="word__button-hard">Сложно</button>
            <button class="word__button-learned">Изучил</button>
        </div>
        `;

        const authVisibleBlock = card.querySelector('.auth__visible') as HTMLElement;
        if (!this.store.get('auth')) {
            authVisibleBlock.style.display = 'none';
        }

        this.turnOnPlayButton(card);
        const id = word.id ? word.id : word._id;
        this.turnOnHardLearnedButtons(card, id as string);
        return card;
    }

    private async markPage() {
        const app = document.querySelector('.app') as HTMLElement;
        if (document.querySelectorAll('.card__word-hard').length >= 20) {
            app.classList.add('card__word-hard');
        } else {
            app.classList.remove('card__word-hard');
        }
        if (document.querySelectorAll('.card__word-learned').length >= 20) {
            app.classList.add('card__word-learned');
        } else {
            app.classList.remove('card__word-learned');
        }
    }

    private turnOnControls() {
        const prevPageButton = document.querySelector('.page__controls-prev') as HTMLElement;
        const nextPageButton = document.querySelector('.page__controls-next') as HTMLElement;
        const groupControlPanel = document.querySelector('.group__controls') as HTMLElement;

        if (this.page === 0 || this.group === 6) {
            prevPageButton.setAttribute('disabled', 'true');
        } else {
            prevPageButton.removeAttribute('disabled');
        }
        if (this.page === 29 || this.group === 6) {
            nextPageButton.setAttribute('disabled', 'true');
        } else {
            nextPageButton.removeAttribute('disabled');
        }

        prevPageButton.addEventListener('click', () => {
            this.page -= 1;
            this.store.set('page', this.page);
            this.render();
        });
        nextPageButton.addEventListener('click', () => {
            this.page += 1;
            this.store.set('page', this.page);
            this.render();
        });

        groupControlPanel.addEventListener('click', (e) => {
            if (e.target !== groupControlPanel) {
                this.group = Number((e.target as HTMLElement).innerText) - 1;
                this.store.set('group', this.group);
                this.render();
            }
        });
    }

    private filterCards(wordsData: AWPaginatedResults): Element[] {
        const wordsIds = wordsData?.map((item) => item['_id']);
        const cards = [...document.querySelectorAll('.card')];
        const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
        const filteredCardsIds = cardIds.filter((id) => wordsIds?.includes(id as string));
        return cards.filter((card) => filteredCardsIds?.includes((card as HTMLElement).dataset.id as string));
    }

    private async markHardWords() {
        let wordsData;
        if (this.group < 6) {
            wordsData = (await this.tbController.getHardAggregatedWords()) as AWPaginatedResults;
            wordsData?.sort((wordA, wordB) => wordA.page - wordB.page);
        } else {
            wordsData = (await this.tbController.getAllHardAggregatedWords()) as AWPaginatedResults;
        }
        const filteredCards = this.filterCards(wordsData);
        filteredCards.forEach((card) => {
            card.classList.add('card__word-hard');
            const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
            setHardButton.innerText = 'Не сложно';
        });
    }

    private async markLearnedWords() {
        let wordsData;
        if (this.group < 6) {
            wordsData = (await this.tbController.getLearnedAggregatedWords()) as AWPaginatedResults;
        } else {
            wordsData = (await this.tbController.getAllLearnedAggregatedWords()) as AWPaginatedResults;
        }
        const filteredCards = this.filterCards(wordsData);
        filteredCards.forEach((card) => {
            card.classList.add('card__word-learned');
            const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
            setLearnedButton.innerText = 'Забыл';
        });
    }

    public async render() {
        this.getParam('page');
        this.getParam('group');
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <p>Страница ${this.page} Группа ${this.group + 1}</p>
        <div class="page__controls">
            <button class="page__controls-prev">Prev page</button>
            <button class="page__controls-next">Next page</button>
        </div>
        <div class="group__controls">
        <button class="group__controls-button">1</button>
        <button class="group__controls-button">2</button>
        <button class="group__controls-button">3</button>
        <button class="group__controls-button">4</button>
        <button class="group__controls-button">5</button>
        <button class="group__controls-button">6</button>
        <button class="group__controls-button">7</button>
        </div>
        `;
        this.turnOnControls();
        const cards = document.createElement('div');
        cards.classList.add('cards__container');
        if (this.group < 6) {
            await this.controller.getWords(this.page, this.group).then((value) =>
                value.forEach((item: Word) => {
                    cards.append(this.drawCard(item));
                })
            );
        } else {
            await this.tbController
                .getAllHardAggregatedWords()
                .then((value) => value?.forEach((item) => cards.append(this.drawCard(item))));
        }
        app.append(cards);
        await this.markHardWords();
        await this.markLearnedWords();
        await this.markPage();
    }
}
