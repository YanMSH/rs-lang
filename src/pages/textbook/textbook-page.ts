import './textbook-page.css';
import Controller from '../../core/components/controller/controller';
import { Word } from '../../core/types/controller-types';
import Storage from '../../core/components/service/storage/storage';
import TextbookController from './textbook-controller';

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

    getParam(param: 'page' | 'group'): number {
        if (this[param] === null) {
            this.store.set(param, 0);
        }
        return this.store.get(param) as number;
    }

    drawCard(word: Word) {
        const card = document.createElement('div');
        card.dataset.id = word.id;
        card.classList.add('card');
        card.innerHTML = `
        <img src="https://rs-back.herokuapp.com/${word.image}" class="word__pic">
        <p class="word__word"><span>${word.word}</span>: <span>${word.transcription}</span>, <span>${word.wordTranslate}</span></p>
        <p class="word__meaning"><span>${word.textMeaning}</span>: <span>${word.textMeaningTranslate}</span></p>
        <p class="word__example"><span>${word.textExample}</span>: <span>${word.textExampleTranslate}</span></p>
        <button class="word__button-hard">Сложно</button>
        <button class="word__button-learned">Изучил</button>`;
        const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
        setHardButton.onclick = () => {
            card.classList.toggle('card__word-hard');
            if (setHardButton.innerText === 'Сложно') {
                setHardButton.innerText = 'Не сложно';
            } else {
                setHardButton.innerText = 'Сложно';
            }
            const id = word.id;
            this.tbController.postHardWord(id);
        };
        const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
        setLearnedButton.onclick = () => {
            card.classList.toggle('card__word-learned');
            if (setLearnedButton.innerText === 'Изучил') {
                setLearnedButton.innerText = 'Забыл';
            } else {
                setLearnedButton.innerText = 'Изучил';
            }
            const id = word.id;
            this.tbController.postLearnedWord(id);
        };
        return card;
    }

    turnOnControls() {
        const prevPageButton = document.querySelector('.page__controls-prev') as HTMLElement;
        const nextPageButton = document.querySelector('.page__controls-next') as HTMLElement;
        const prevGroupButton = document.querySelector('.group__controls-prev') as HTMLElement;
        const nextGroupButton = document.querySelector('.group__controls-next') as HTMLElement;
        /**** TEMP THINGS THAT SHOULD BE REMOVED ****/
        const logUserHardWordsButton = document.querySelector('.userHardWords') as HTMLElement;
        const logUserLearnedWordsButton = document.querySelector('.userLearnedWords') as HTMLElement;

        logUserHardWordsButton.onclick = async () => {
            // const cards = [...document.querySelectorAll('.card')];
            // const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
            // const filteredIds = await this.tbController.getFilteredWords(cardIds as string[]);
            // const filteredCards = cards.filter((card) =>
            //     filteredIds?.includes((card as HTMLElement).dataset.id as string)
            // );
            // console.log(filteredCards);
            // filteredCards.forEach((card) => card.classList.add('card__word-hard'));
            const wordsData = await this.tbController.getHardAggregatedWords();
            const wordsIds = wordsData?.map((item) => item['_id']);
            const cards = [...document.querySelectorAll('.card')];
            const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
            const filteredCardsIds = cardIds.filter((id) => wordsIds?.includes(id as string));
            const filteredCards = cards.filter((card) =>
                filteredCardsIds?.includes((card as HTMLElement).dataset.id as string)
            );
            filteredCards.forEach((card) => card.classList.add('card__word-hard'));
            console.log(wordsData);
            // console.log(await this.tbController.getLearnedAggregatedWords());
        };
        logUserLearnedWordsButton.onclick = async () => {
            const wordsData = await this.tbController.getLearnedAggregatedWords();
            const wordsIds = wordsData?.map((item) => item['_id']);
            const cards = [...document.querySelectorAll('.card')];
            const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
            const filteredCardsIds = cardIds.filter((id) => wordsIds?.includes(id as string));
            const filteredCards = cards.filter((card) =>
                filteredCardsIds?.includes((card as HTMLElement).dataset.id as string)
            );
            filteredCards.forEach((card) => card.classList.add('card__word-learned'));
            console.log(wordsData);
        };
        /*******************************************/
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
        });
        nextPageButton.addEventListener('click', () => {
            this.page += 1;
            this.store.set('page', this.page);
            this.render();
        });

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
        });
        nextGroupButton.addEventListener('click', () => {
            this.group += 1;
            this.store.set('group', this.group);
            this.render();
        });
    }

    async markHardWords() {
        const learnedWordsData = await this.tbController.getHardAggregatedWords();
        const learnedWordsIds = learnedWordsData?.map((item) => item['_id']);
        const cards = [...document.querySelectorAll('.card')];
        const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
        const filteredCardsIds = cardIds.filter((id) => learnedWordsIds?.includes(id as string));
        const filteredCards = cards.filter((card) =>
            filteredCardsIds?.includes((card as HTMLElement).dataset.id as string)
        );
        filteredCards.forEach((card) => {
            card.classList.add('card__word-hard');
            const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
            setHardButton.innerText = 'Не сложно';
        });
    }
    async markLearnedWords() {
        const learnedWordsData = await this.tbController.getLearnedAggregatedWords();
        const learnedWordsIds = learnedWordsData?.map((item) => item['_id']);
        const cards = [...document.querySelectorAll('.card')];
        const cardIds = cards.map((elem) => (elem as HTMLElement).dataset.id);
        const filteredCardsIds = cardIds.filter((id) => learnedWordsIds?.includes(id as string));
        const filteredCards = cards.filter((card) =>
            filteredCardsIds?.includes((card as HTMLElement).dataset.id as string)
        );
        filteredCards.forEach((card) => {
            card.classList.add('card__word-learned');
            const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
            setLearnedButton.innerText = 'Забыл';
        });
    }

    async render() {
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
            <!-- TEMP THING THAT SHOULD BE REMOVED -->    
            <button class="userHardWords">Check hardWords</button>
            <button class="userLearnedWords">Check learnedWords</button>
            <!-- ********************************* -->
        </div>`;
        this.turnOnControls();
        const cards = document.createElement('div');
        cards.classList.add('cards__container');
        await this.controller.getWords(this.page, this.group).then((value) =>
            value.forEach((item: Word) => {
                cards.append(this.drawCard(item));
            })
        );
        app.append(cards);
        await this.markHardWords();
        await this.markLearnedWords();
    }
}
