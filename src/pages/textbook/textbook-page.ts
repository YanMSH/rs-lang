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
        const hiddenText = card.querySelector('.card__hidden') as HTMLElement;
        const meaningText = card.querySelector('.card__meaning-eng') as HTMLElement;
        const exampleText = card.querySelector('.card__example-eng') as HTMLElement;
        const audioPlayButton = card.querySelector('.word__audio-play') as HTMLButtonElement;
        const audio = card.querySelector('.word__audio') as HTMLAudioElement;
        const audioMeaning = card.querySelector('.word__audio-meaning') as HTMLAudioElement;
        const audioExample = card.querySelector('.word__audio-example') as HTMLAudioElement;

        const toggleButton = (button: HTMLElement) => {
            button.classList.toggle('btn-toggled');
            const paths = [...button.querySelectorAll('path')];
            paths.forEach((item) => item.classList.toggle('icon-toggled'));
        };

        audioPlayButton.addEventListener('click', () => {
            toggleButton(audioPlayButton);
            hiddenText.classList.add('hidden__revail');
            audio.play();
        });
        audio.addEventListener('ended', () => {
            meaningText.classList.add('underline');
            audioMeaning.play();
        });
        audioMeaning.addEventListener('ended', () => {
            meaningText.classList.remove('underline');
            audioExample.play();
            exampleText.classList.add('underline');
        });
        audioExample.addEventListener('ended', () => {
            exampleText.classList.remove('underline');
            hiddenText.classList.remove('hidden__revail');
            toggleButton(audioPlayButton);
        });
    }

    private turnOnHardLearnedButtons(card: HTMLElement, id: string) {
        const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
        const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
        setHardButton.onclick = () => {
            setHardButton.classList.toggle('card__word-hard');
            setLearnedButton.classList.remove('card__word-learned');
            this.tbController.postHardWord(id as string);
        };
        setLearnedButton.onclick = () => {
            setLearnedButton.classList.toggle('card__word-learned');
            setHardButton.classList.remove('card__word-hard');
            this.tbController.postLearnedWord(id as string);
        };
    }

    private capitalizeWord(card: HTMLElement) {
        const wordContainer = card.querySelector('.card__main-word') as HTMLElement;
        const word = wordContainer.innerText;
        wordContainer.innerText = word[0].toUpperCase() + word.slice(1);
    }

    private drawCard(word: Word) {
        const card = document.createElement('div');
        card.dataset.id = word.id ? word.id : word._id;
        card.classList.add('card');

        card.innerHTML = `
        <div class="card__main">
            <div class="card__buttons-toggleables auth__visible">
                <div class="btn-hard btn word__button-hard"> 
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.0435 16.6957C13.0435 17.2719 12.5763 17.7391 12 17.7391C11.4237 17.7391 10.9565 17.2719 10.9565 16.6957C10.9565 16.1194 11.4237 15.6522 12 15.6522C12.5763 15.6522 13.0435 16.1194 13.0435 16.6957Z" fill="#F9F9F9"/>
                        <path d="M10.4174 8.69782C10.534 8.46457 10.6966 8.25513 10.9259 8.10226C11.1504 7.95265 11.4848 7.82609 12 7.82609C12.4006 7.82609 12.7998 7.94902 13.0793 8.1587C13.338 8.3527 13.5 8.61923 13.5 9C13.5 9.50027 13.2721 9.84541 12.8519 10.2377C12.708 10.3719 12.5742 10.4835 12.4261 10.607C12.3317 10.6857 12.2315 10.7692 12.1192 10.8665C11.8626 11.0889 11.5724 11.361 11.3488 11.6965L11.2174 11.8936V13.5652C11.2174 13.9974 11.5678 14.3478 12 14.3478C12.4322 14.3478 12.7826 13.9974 12.7826 13.5652V12.3965C12.8756 12.2918 12.9946 12.1792 13.1444 12.0493C13.2107 11.9919 13.2901 11.9253 13.376 11.8535C13.5499 11.7079 13.7501 11.5404 13.9198 11.3819C14.4778 10.8611 15.0652 10.1302 15.0652 9C15.0652 8.07642 14.6293 7.36469 14.0185 6.90652C13.4285 6.46403 12.6863 6.26087 12 6.26087C11.2109 6.26087 10.567 6.4604 10.0577 6.79992C9.55334 7.13617 9.22685 7.5789 9.01738 7.99783C8.82409 8.38442 8.98079 8.85452 9.36738 9.04781C9.75397 9.24111 10.2241 9.08441 10.4174 8.69782Z" fill="#F9F9F9"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77112 0.730309C11.0975 -0.243437 12.9025 -0.243436 14.2289 0.73031L15.664 1.78388C15.95 1.99381 16.2824 2.13151 16.633 2.18527L18.3928 2.45507C20.0193 2.70443 21.2956 3.98074 21.5449 5.60718L21.8147 7.36696C21.8685 7.71759 22.0062 8.05005 22.2161 8.33599L23.2697 9.77112C24.2434 11.0975 24.2434 12.9025 23.2697 14.2289L22.2161 15.664C22.0062 15.95 21.8685 16.2824 21.8147 16.633L21.5449 18.3928C21.2956 20.0193 20.0193 21.2956 18.3928 21.5449L16.633 21.8147C16.2824 21.8685 15.95 22.0062 15.664 22.2161L14.2289 23.2697C12.9025 24.2434 11.0975 24.2434 9.77112 23.2697L8.33599 22.2161C8.05004 22.0062 7.71759 21.8685 7.36696 21.8147L5.60718 21.5449C3.98074 21.2956 2.70443 20.0193 2.45507 18.3928L2.18527 16.633C2.13151 16.2824 1.99381 15.95 1.78388 15.664L0.730309 14.2289C-0.243437 12.9025 -0.243436 11.0975 0.730309 9.77112L1.78388 8.33599C1.99381 8.05004 2.13151 7.71759 2.18527 7.36696L2.45507 5.60718C2.70443 3.98074 3.98074 2.70443 5.60718 2.45507L7.36696 2.18527C7.71759 2.13151 8.05004 1.99381 8.33599 1.78388L9.77112 0.730309ZM13.3026 1.99203C12.5274 1.42295 11.4726 1.42295 10.6974 1.99203L9.26226 3.0456C8.77298 3.4048 8.20413 3.64042 7.60416 3.73241L5.84438 4.00221C4.89385 4.14794 4.14794 4.89385 4.00221 5.84438L3.73241 7.60416C3.64042 8.20413 3.4048 8.77298 3.0456 9.26226L1.99203 10.6974C1.42295 11.4726 1.42295 12.5274 1.99203 13.3026L3.0456 14.7377C3.4048 15.227 3.64042 15.7959 3.73241 16.3958L4.00221 18.1556C4.14794 19.1062 4.89385 19.8521 5.84438 19.9978L7.60416 20.2676C8.20413 20.3596 8.77298 20.5952 9.26226 20.9544L10.6974 22.008C11.4726 22.5771 12.5274 22.5771 13.3026 22.008L14.7377 20.9544C15.227 20.5952 15.7959 20.3596 16.3958 20.2676L18.1556 19.9978C19.1062 19.8521 19.8521 19.1062 19.9978 18.1556L20.2676 16.3958C20.3596 15.7959 20.5952 15.227 20.9544 14.7377L22.008 13.3026C22.5771 12.5274 22.5771 11.4726 22.008 10.6974L20.9544 9.26226C20.5952 8.77298 20.3596 8.20412 20.2676 7.60416L19.9978 5.84438C19.8521 4.89385 19.1062 4.14794 18.1556 4.00221L16.3958 3.73241C15.7959 3.64042 15.227 3.4048 14.7377 3.0456L13.3026 1.99203Z" fill="#F9F9F9"/>
                    </svg>
                </div>
                    <div class="btn-learned btn word__button-learned">
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M17.249 9.68382C17.5547 9.3782 17.5547 8.88267 17.249 8.57705C16.9434 8.27142 16.4479 8.27142 16.1423 8.57705L10.4348 14.2845L7.85774 11.7075C7.55211 11.4019 7.05659 11.4019 6.75096 11.7075C6.44533 12.0131 6.44533 12.5086 6.75096 12.8143L9.88139 15.9447C10.187 16.2503 10.6825 16.2503 10.9882 15.9447L17.249 9.68382Z" fill="#F9F9F9"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2289 0.73031C12.9025 -0.243436 11.0975 -0.243437 9.77112 0.730309L8.33599 1.78388C8.05004 1.99381 7.71759 2.13151 7.36696 2.18527L5.60718 2.45507C3.98074 2.70443 2.70443 3.98074 2.45507 5.60718L2.18527 7.36696C2.13151 7.71759 1.99381 8.05004 1.78388 8.33599L0.730309 9.77112C-0.243436 11.0975 -0.243437 12.9025 0.730309 14.2289L1.78388 15.664C1.99381 15.95 2.13151 16.2824 2.18527 16.633L2.45507 18.3928C2.70443 20.0193 3.98074 21.2956 5.60718 21.5449L7.36696 21.8147C7.71759 21.8685 8.05004 22.0062 8.33599 22.2161L9.77112 23.2697C11.0975 24.2434 12.9025 24.2434 14.2289 23.2697L15.664 22.2161C15.95 22.0062 16.2824 21.8685 16.633 21.8147L18.3928 21.5449C20.0193 21.2956 21.2956 20.0193 21.5449 18.3928L21.8147 16.633C21.8685 16.2824 22.0062 15.95 22.2161 15.664L23.2697 14.2289C24.2434 12.9025 24.2434 11.0975 23.2697 9.77112L22.2161 8.33599C22.0062 8.05005 21.8685 7.71759 21.8147 7.36696L21.5449 5.60718C21.2956 3.98074 20.0193 2.70443 18.3928 2.45507L16.633 2.18527C16.2824 2.13151 15.95 1.99381 15.664 1.78388L14.2289 0.73031ZM10.6974 1.99203C11.4726 1.42295 12.5274 1.42295 13.3026 1.99203L14.7377 3.0456C15.227 3.4048 15.7959 3.64042 16.3958 3.73241L18.1556 4.00221C19.1062 4.14794 19.8521 4.89385 19.9978 5.84438L20.2676 7.60416C20.3596 8.20412 20.5952 8.77298 20.9544 9.26226L22.008 10.6974C22.5771 11.4726 22.5771 12.5274 22.008 13.3026L20.9544 14.7377C20.5952 15.227 20.3596 15.7959 20.2676 16.3958L19.9978 18.1556C19.8521 19.1062 19.1062 19.8521 18.1556 19.9978L16.3958 20.2676C15.7959 20.3596 15.227 20.5952 14.7377 20.9544L13.3026 22.008C12.5274 22.5771 11.4726 22.5771 10.6974 22.008L9.26226 20.9544C8.77298 20.5952 8.20413 20.3596 7.60416 20.2676L5.84438 19.9978C4.89385 19.8521 4.14794 19.1062 4.00221 18.1556L3.73241 16.3958C3.64042 15.7959 3.4048 15.227 3.0456 14.7377L1.99203 13.3026C1.42295 12.5274 1.42295 11.4726 1.99203 10.6974L3.0456 9.26226C3.4048 8.77298 3.64042 8.20413 3.73241 7.60416L4.00221 5.84438C4.14794 4.89385 4.89385 4.14794 5.84438 4.00221L7.60416 3.73241C8.20413 3.64042 8.77298 3.4048 9.26226 3.0456L10.6974 1.99203Z" fill="#F9F9F9"/>
                    </svg>                
                </div>
            </div>
            <div class="card__main-text">
                <div class="card__main-word">${word.word}</div>
                <div class="card__main-etc">
                    <span class="word__transcription">${word.transcription},</span>
                    <span class="word__translation">${word.wordTranslate}</span>
                </div>
            </div>
            <div class="card__buttons-audio">
                <div class="btn-audio btn word__audio-play">
                    <svg class="icon audio-icon" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.59402 0.0570034C9.84082 0.163756 10 0.402801 10 0.666679V15.3333C10 15.5972 9.84082 15.8362 9.59402 15.943C9.34721 16.0497 9.05924 16.0041 8.85955 15.8266L4.05459 11.5555H1.59091C0.712275 11.5555 0 10.8591 0 10V6C0 5.14089 0.712275 4.44445 1.59091 4.44445H4.05459L8.85955 0.173386C9.05924 -0.00411749 9.34721 -0.0497494 9.59402 0.0570034ZM8.63637 2.17371L4.77682 5.60441C4.65132 5.71597 4.4878 5.77778 4.31818 5.77778H1.59091C1.46539 5.77778 1.36364 5.87727 1.36364 6V10C1.36364 10.1227 1.46539 10.2222 1.59091 10.2222H4.31818C4.4878 10.2222 4.65132 10.284 4.77682 10.3956L8.63637 13.8263V2.17371Z" fill="#F9F9F9"/>
                        <path d="M16.1068 1.08607C16.3731 0.825716 16.8048 0.825716 17.0711 1.08607C20.9763 4.90452 20.9763 11.0955 17.0711 14.9139C16.8048 15.1743 16.3731 15.1743 16.1068 14.9139C15.8406 14.6536 15.8406 14.2315 16.1068 13.9711C19.4795 10.6733 19.4795 5.32663 16.1068 2.02887C15.8406 1.76852 15.8406 1.34641 16.1068 1.08607Z" fill="#F9F9F9"/>
                        <path d="M13.8569 4.22878C13.5907 3.96843 13.159 3.96843 12.8927 4.22878C12.6264 4.48912 12.6264 4.91123 12.8927 5.17158C14.4903 6.73368 14.4903 9.26633 12.8927 10.8284C12.6264 11.0888 12.6264 11.5109 12.8927 11.7712C13.159 12.0316 13.5907 12.0316 13.8569 11.7712C15.9871 9.68844 15.9871 6.31157 13.8569 4.22878Z" fill="#F9F9F9"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="card__hidden card__secondary">
            <div class="card__meaning card__hidden-text">
                <div class="card__meaning-eng">${word.textMeaning}</div>
                <div class="card__meaning-ru">${word.textMeaningTranslate}</div>
            </div>
            <div class="card__example card__hidden-text">
                <div class="card__example-eng">${word.textExample}</div>
                <div class="card__example-ru">${word.textExampleTranslate}</div>
            </div>
        </div>
        <img src="https://rs-back.herokuapp.com/${word.image}" class="word__pic">
        <audio class="word__audio" src="https://rs-back.herokuapp.com/${word.audio}"></audio>
        <audio class="word__audio-meaning" src="https://rs-back.herokuapp.com/${word.audioMeaning}"></audio>
        <audio class="word__audio-example" src="https://rs-back.herokuapp.com/${word.audioExample}"></audio>
`;

        // card.innerHTML = `
        // <img src="https://rs-back.herokuapp.com/${word.image}" class="word__pic">
        // <p class="word__word"><span>${word.word}</span>: <span>${word.transcription}</span>, <span>${word.wordTranslate}</span></p>
        // <p class="word__meaning"><span>${word.textMeaning}</span>: <span>${word.textMeaningTranslate}</span></p>
        // <p class="word__example"><span>${word.textExample}</span>: <span>${word.textExampleTranslate}</span></p>
        // <audio class="word__audio" src="https://rs-back.herokuapp.com/${word.audio}"></audio>
        // <audio class="word__audio-meaning" src="https://rs-back.herokuapp.com/${word.audioMeaning}"></audio>
        // <audio class="word__audio-example" src="https://rs-back.herokuapp.com/${word.audioExample}"></audio>
        // <button class="word__audio-play">Play</button>
        // <div class="auth__visible">
        //     <button class="word__button-hard">Сложно</button>
        //     <button class="word__button-learned">Изучил</button>
        // </div>
        // `;

        const authVisibleBlock = card.querySelector('.auth__visible') as HTMLElement;
        if (!this.store.get('auth')) {
            authVisibleBlock.style.visibility = 'hidden';
        }

        this.turnOnPlayButton(card);
        this.capitalizeWord(card);
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
            const setHardButton = card.querySelector('.word__button-hard') as HTMLButtonElement;
            setHardButton.classList.add('card__word-hard');
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
            const setLearnedButton = card.querySelector('.word__button-learned') as HTMLButtonElement;
            setLearnedButton.classList.add('card__word-learned');
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
