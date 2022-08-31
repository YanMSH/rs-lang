import './global.css';

import TextbookPage from './pages/textbook/textbook-page';
import AuthPage from './pages/auth/auth-page';
import { SprintGameApp } from './pages/sprint-game/app/sprint-game-app';
import AudioCallApp from './pages/audio-call/app/audio-call-app';
import RegPage from './pages/registration/reg-page';
// import App from './core/components/app/app';

// const app = new App();
const textbook = new TextbookPage();
const auth = new AuthPage();
const sprintGame = new SprintGameApp();
const audioCallGame = new AudioCallApp();
const regPage = new RegPage();
const authLink = document.querySelector('.header__nav-auth') as HTMLElement;
const sprintLink = document.querySelector('.header__nav-game-sprint') as HTMLElement;
const audioCallLink = document.querySelector('.header__nav-game-audiocall') as HTMLElement;

const textbookLink = document.querySelector('.header__nav-learn-textbook') as HTMLElement;
textbookLink.onclick = () => textbook.render();
audioCallLink.onclick = () => audioCallGame.renderAudioCall();

sprintLink.onclick = () => sprintGame.starting();
authLink.onclick = () => auth.render();
regPage.render();
