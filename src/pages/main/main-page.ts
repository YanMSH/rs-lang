import './main-page.css';
import Storage from '../../core/components/service/storage/storage';
import MainPageTemplates from './main-page-templates';
import RegPage from '../registration/reg-page';
import AuthPage from '../auth/auth-page';
import TextbookPage from '../textbook/textbook-page';
import { SprintGameApp } from '../sprint-game/app/sprint-game-app';
import AudioCallApp from '../audio-call/app/audio-call-app';

export default class MainPage {
    store: Storage;
    regPage: RegPage;
    authPage: AuthPage;
    textbook: TextbookPage;
    sprintGame: SprintGameApp;
    audiocallGame: AudioCallApp;
    template: MainPageTemplates;
    constructor() {
        this.store = new Storage();
        this.regPage = new RegPage();
        this.authPage = new AuthPage();
        this.textbook = new TextbookPage();
        this.sprintGame = new SprintGameApp();
        this.audiocallGame = new AudioCallApp();
        this.template = new MainPageTemplates();
    }
    turnOnWelcomeLinks() {
        const regButton = document.querySelector('.welcome__banner-reg-link') as HTMLElement;
        const authButton = document.querySelector('.welcome__banner-auth-link') as HTMLElement;

        regButton.onclick = () => {
            this.regPage.render();
        };
        authButton.onclick = () => {
            this.authPage.render();
        };
    }
    turnOnMainLinks() {
        const textbookLink = document.querySelector('.main-page__textbook') as HTMLElement;
        const sprintGameLink = document.querySelector('.games__sprint') as HTMLElement;
        const audiocallGameLink = document.querySelector('.games__audiocall') as HTMLElement;
        textbookLink.onclick = () => this.textbook.render();
        sprintGameLink.onclick = () => this.audiocallGame.renderAudioCall();
        audiocallGameLink.onclick = () => this.audiocallGame.renderAudioCall();
    }

    async render() {
        const app = document.querySelector('.app') as HTMLElement;
        if (this.store.inStore('auth')) {
            app.innerHTML = await this.template.buildMainPage();
            this.turnOnMainLinks();
        } else {
            app.innerHTML = this.template.buildWelcomePage();
            this.turnOnWelcomeLinks();
        }
    }
}
