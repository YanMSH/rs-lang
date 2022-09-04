import './global.css';

import TextbookPage from './pages/textbook/textbook-page';
import AuthPage from './pages/auth/auth-page';
import { SprintGameApp } from './pages/sprint-game/app/sprint-game-app';
import AudioCallApp from './pages/audio-call/app/audio-call-app';
import MainPage from './pages/main/main-page';
// import App from './core/components/app/app';

// const app = new App();
const logoLink = document.querySelector('.header__title-link') as HTMLElement;
const mainPage = new MainPage();
const textbook = new TextbookPage();
const auth = new AuthPage();
const sprintGame = new SprintGameApp();
const audioCallGame = new AudioCallApp();

const authLink = document.querySelector('.header__nav-auth') as HTMLElement;
const sprintLink = document.querySelector('.header__nav-game-sprint') as HTMLElement;
const audioCallLink = document.querySelector('.header__nav-game-audiocall') as HTMLElement;

const textbookLink = document.querySelector('.header__nav-learn-textbook') as HTMLElement;
logoLink.onclick = () => mainPage.render();
textbookLink.onclick = () => textbook.render();
audioCallLink.onclick = () => audioCallGame.renderAudioCall();

sprintLink.onclick = () => sprintGame.starting();
authLink.onclick = () => auth.render();
mainPage.render();

import StatisticController from './pages/statistic-page/statistic-controller/statistic-cotroller';
const statistic = new StatisticController();
const statisticLink = document.querySelector('.header__nav-stats') as HTMLElement;
statisticLink.onclick = () => statistic.render();
