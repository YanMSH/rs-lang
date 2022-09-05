import './textbook-page.css';
import Controller from '../../core/components/controller/controller';
import { Word } from '../../core/types/controller-types';
import Storage from '../../core/components/service/storage/storage';
import TextbookController from './textbook-controller';
import { AWPaginatedResults } from '../../core/types/loader-types';
import { LAST_PAGE } from '../../core/constants/loader-const';
import { pageButtons } from '../../core/types/textbook-types';
import AudioCallApp from '../audio-call/app/audio-call-app';
import { SprintGameApp } from '../sprint-game/app/sprint-game-app';

export default class TextbookPage {
    tbController: TextbookController;
    controller: Controller;
    store: Storage;
    page: number;
    group: number;
    audiocallGame: AudioCallApp;
    sprintGame: SprintGameApp;
    constructor() {
        this.tbController = new TextbookController();
        this.controller = new Controller();
        this.store = new Storage();
        this.page = this.getParam('page') || 0;
        this.group = this.getParam('group') || 0;
        this.audiocallGame = new AudioCallApp();
        this.sprintGame = new SprintGameApp();
    }

    private getParam(param: 'page' | 'group'): number {
        if (this[param] === null) {
            this.store.set(param, 0);
        }
        return this.store.get(param) as number;
    }

    private turnOnPlayButton(card: HTMLElement): void {
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

    private turnOnHardLearnedButtons(card: HTMLElement, id: string): void {
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

    private capitalizeWord(card: HTMLElement): void {
        const wordContainer = card.querySelector('.card__main-word') as HTMLElement;
        const word = wordContainer.innerText;
        wordContainer.innerText = word[0].toUpperCase() + word.slice(1);
    }

    private drawCard(word: Word): HTMLDivElement {
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

    private async markPage(): Promise<void> {
        const app = document.querySelector('.app') as HTMLElement;
        if (document.querySelectorAll('.card__word-learned').length >= 20) {
            app.classList.add('app_learned-page');
        } else {
            app.classList.remove('app_learned-page');
        }
        if (document.querySelectorAll('.card__word-hard').length >= 20) {
            app.classList.add('app__hard-page');
        } else {
            app.classList.remove('app__hard-page');
        }
    }

    private turnOnControls(): void {
        const groupControlPanel = document.querySelector('.group__controls') as HTMLElement;
        const pageControlPanel = document.querySelector('.page__controls') as HTMLElement;
        const gameControlPanel = document.querySelector('.game__controls') as HTMLElement;
        const sprintGameButton = document.querySelector('.game-sprint') as HTMLElement;
        const audiocallGameButton = document.querySelector('.game-audiocall') as HTMLElement;

        if (!this.store.get('auth')) {
            gameControlPanel.style.visibility = 'hidden';
        } else {
            sprintGameButton.addEventListener('click', () => {
                this.sprintGame.startWithoutLevel();
            });
            audiocallGameButton.addEventListener('click', () => {
                this.audiocallGame.startAudioCallGame();
            });
        }

        groupControlPanel.addEventListener('click', (e) => {
            if (e.target !== groupControlPanel) {
                this.group = Number((e.target as HTMLElement).innerText) - 1;
                this.store.set('group', this.group);
                this.render();
            }
        });
        pageControlPanel.addEventListener('click', (e) => {
            let target = e.target as HTMLElement;
            if (target !== pageControlPanel) {
                if (target.tagName === 'IMG') {
                    target = target.parentElement as HTMLElement;
                }
                const changePage = () => {
                    this.store.set('page', this.page);
                    this.render();
                };
                switch ((target as HTMLElement).dataset.button) {
                    case pageButtons.prevArrow:
                        this.page -= 1;
                        changePage();
                        break;
                    case pageButtons.nextPage:
                        this.page += 1;
                        changePage();
                        break;
                    case pageButtons.jumpPage:
                        this.page += 2;
                        changePage();
                        break;
                    case pageButtons.preLastPage:
                        this.page = LAST_PAGE - 1;
                        changePage();
                        break;
                    case pageButtons.lastPage:
                        this.page = LAST_PAGE;
                        changePage();
                        break;
                    case pageButtons.nextArrow:
                        this.page += 1;
                        changePage();
                        break;
                }
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

    private async markHardWords(): Promise<void> {
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

    private async markLearnedWords(): Promise<void> {
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

    private markButtons(): void {
        const groupButtons = [...document.querySelectorAll('.group__controls-button')];
        const currentGroup = this.store.get('group') as number;
        groupButtons[currentGroup].classList.add('controls-current');
        if (!this.store.get('auth')) {
            groupButtons[groupButtons.length - 1].classList.add('group__controls-disabled');
        }
    }

    private makePagination(): void {
        const pageControls = document.querySelector('.page__controls') as HTMLElement;
        const makeControlButton = () => {
            const button = document.createElement('button') as HTMLButtonElement;
            button.classList.add('control__button');
            return button;
        };
        const currentPageButton = makeControlButton();
        currentPageButton.innerText = (this.page + 1).toString();
        currentPageButton.classList.add('controls-current');
        currentPageButton.dataset.button = pageButtons.currentPage;
        pageControls.append(currentPageButton);
        if (this.page > 0) {
            const prevArrowButton = makeControlButton();
            prevArrowButton.innerHTML = '<img src="./../../assets/svg/prev-arrow.svg">';
            prevArrowButton.dataset.button = pageButtons.prevArrow;
            pageControls.prepend(prevArrowButton);
        }
        if (this.page < LAST_PAGE) {
            const nextPageButton = makeControlButton();
            nextPageButton.innerText = (this.page + 2).toString();
            nextPageButton.dataset.button = pageButtons.nextPage;
            pageControls.append(nextPageButton);
        }
        if (this.page <= LAST_PAGE - 3) {
            const jumpPageButton = makeControlButton();
            jumpPageButton.innerText = '...';
            jumpPageButton.dataset.button = pageButtons.jumpPage;
            pageControls.append(jumpPageButton);
        }
        if (this.page <= LAST_PAGE - 3) {
            const preLastPageButton = makeControlButton();
            preLastPageButton.innerText = LAST_PAGE.toString();
            preLastPageButton.dataset.button = pageButtons.preLastPage;
            pageControls.append(preLastPageButton);
        }
        if (this.page < LAST_PAGE - 1) {
            const lastPageButton = makeControlButton();
            lastPageButton.innerText = (LAST_PAGE + 1).toString();
            lastPageButton.dataset.button = pageButtons.lastPage;
            pageControls.append(lastPageButton);
        }
        if (this.page < LAST_PAGE) {
            const nextArrowButton = makeControlButton();
            nextArrowButton.innerHTML = '<img src="./../../assets/svg/next-arrow.svg">';
            nextArrowButton.dataset.button = pageButtons.nextArrow;
            pageControls.append(nextArrowButton);
        }
    }

    public async render(): Promise<void> {
        this.getParam('page');
        this.getParam('group');
        if (this.store.get('page') === null) {
            this.store.set('page', 0);
        }
        if (this.store.get('group') === null) {
            this.store.set('group', 0);
        }

        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `

        <h2 class="textbook__title">Учебник</h2>
        <div class="app__controls">
            <div class="group__controls textbook__control-panel">
                <button class="group__controls-button control__button">1</button>
                <button class="group__controls-button control__button">2</button>
                <button class="group__controls-button control__button">3</button>
                <button class="group__controls-button control__button">4</button>
                <button class="group__controls-button control__button">5</button>
                <button class="group__controls-button control__button">6</button>
                <button class="group__controls-button control__button">7</button>
            </div>
            <div class="game__controls">
                <button class="control__button game__button game-sprint">
                    <svg width="32" height="23" viewBox="0 0 32 30" fill="#1c1c1c" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#1c1c1c" fill-rule="evenodd" clip-rule="evenodd" d="M0.678837 0.495468C1.2805 -0.029819 2.14033 -0.148786 2.86417 0.193106L31.0481 13.5054C31.6296 13.7801 32 14.3616 32 15C32 15.6384 31.6296 16.2199 31.0481 16.4946L2.86417 29.8069C2.14034 30.1488 1.2805 30.0298 0.678837 29.5045C0.162256 29.0535 -0.084344 28.3712 0.0258561 27.6977L2.10357 15L0.0258561 2.3023C-0.0843441 1.62883 0.162257 0.94647 0.678837 0.495468ZM4.14135 16.0834L2.24036 27.7011L29.1303 15L2.24036 2.29888L4.14135 13.9166H14.8724C15.4762 13.9166 15.9657 14.4016 15.9657 15C15.9657 15.5984 15.4762 16.0834 14.8724 16.0834H4.14135Z" fill="#F4EDED"/>
                    </svg>
                    Спринт
                </button>
                <button class="control__button game__button game-audiocall">
                Аудио-вызов
                <svg width="33" height="25" viewBox="0 0 33 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#1c1c1c" fill-rule="evenodd" clip-rule="evenodd" d="M14.2809 0.423205C14.6482 0.58572 14.8852 0.949629 14.8852 1.35134V23.6791C14.8852 24.0808 14.6482 24.4447 14.2809 24.6072C13.9135 24.7698 13.4848 24.7003 13.1876 24.4301L6.03532 17.928H2.3681C1.06023 17.928 0 16.8678 0 15.5599V9.47053C0 8.16267 1.06023 7.10243 2.3681 7.10243H6.03532L13.1876 0.60038C13.4848 0.330158 13.9135 0.26069 14.2809 0.423205ZM12.8554 3.64557L7.11038 8.8683C6.92357 9.03813 6.68016 9.13223 6.42769 9.13223H2.3681C2.18126 9.13223 2.0298 9.28369 2.0298 9.47053V15.5599C2.0298 15.7468 2.18126 15.8982 2.3681 15.8982H6.42769C6.68016 15.8982 6.92357 15.9923 7.11038 16.1622L12.8554 21.3849V3.64557Z" fill="#F4EDED"/>
                <path fill="#1c1c1c" fill-rule="evenodd" clip-rule="evenodd" d="M21.0187 5.0547C21.1522 5.006 21.2967 4.99564 21.4358 5.0248C21.5749 5.05395 21.703 5.12146 21.8057 5.21967L24.925 8.20449L29.1524 7.32646C29.2915 7.29755 29.4358 7.30811 29.5691 7.35699C29.7024 7.40582 29.8195 7.49097 29.9069 7.60285C29.9944 7.71472 30.0488 7.84882 30.0641 7.99C30.0794 8.13116 30.0548 8.27378 29.9932 8.40176L28.1195 12.2917L30.2606 16.0398C30.3311 16.1631 30.3657 16.3036 30.3605 16.4456C30.3553 16.5876 30.3104 16.7252 30.2311 16.843C30.1517 16.9608 30.0409 17.0541 29.9113 17.1122C29.7816 17.1703 29.6384 17.191 29.4976 17.1719L25.2187 16.5912L22.3147 19.787C22.2191 19.8919 22.0962 19.9681 21.9597 20.0069C21.8232 20.0457 21.6785 20.0456 21.5421 20.0066C21.4056 19.9674 21.2828 19.891 21.1875 19.7858C21.0922 19.6806 21.0283 19.551 21.0028 19.4113L20.2333 15.1617L16.2957 13.3885C16.166 13.3302 16.0553 13.2367 15.9759 13.1187C15.8966 13.0007 15.852 12.8629 15.847 12.7208C15.842 12.5787 15.877 12.438 15.9479 12.3147C16.0187 12.1915 16.1227 12.0905 16.248 12.0233L20.0508 9.97898L20.522 5.68699C20.5376 5.54574 20.5923 5.41165 20.6801 5.29991C20.7679 5.18816 20.8852 5.10322 21.0187 5.0547ZM21.8676 7.38641L21.5207 10.5423C21.5072 10.6648 21.4641 10.7822 21.3953 10.8845C21.3264 10.9867 21.2337 11.0706 21.1252 11.1291L18.3279 12.6335L21.2224 13.9386C21.3349 13.9893 21.4335 14.0666 21.5096 14.1638C21.5856 14.2611 21.6369 14.3754 21.6589 14.4969L22.2261 17.6213L24.3613 15.2714C24.4443 15.18 24.5483 15.1103 24.6642 15.0681C24.7802 15.0259 24.9046 15.0124 25.0269 15.029L28.1741 15.4558L26.5979 12.6988C26.5367 12.5915 26.5025 12.471 26.4982 12.3477C26.494 12.2243 26.5198 12.1017 26.5734 11.9905L27.9517 9.13097L24.8429 9.77672C24.7222 9.8017 24.5972 9.79698 24.4787 9.76298C24.3602 9.72898 24.2518 9.66671 24.1627 9.58153L21.8673 7.38546L21.8676 7.38641Z" fill="#F4EDED"/>
                </svg>
                </button>
            </div>
            <div class="page__controls textbook__control-panel">
            </div>
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
        console.log('amount of hard words:', await this.tbController.getAmountOfHardWords());
        this.makePagination();
        app.append(cards);
        this.markButtons();
        await this.markHardWords();
        await this.markLearnedWords();
        await this.markPage();
    }
}
