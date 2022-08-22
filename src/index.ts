import './global.css';

import WordListPage from './pages/wordlist/wordlist-page';
import AuthPage from './pages/auth/auth-page';
import { SprintGameApp } from './core/components/sprint-game/app/sprint-game-app';
import AudioCallApp from './core/components/audio-call/app/audio-call-app';
// import App from './core/components/app/app';

// const app = new App();
const auth = new AuthPage();
const sprintGame = new SprintGameApp();
const audioCallGame = new AudioCallApp();
const authLink = document.querySelector('.header__nav-auth') as HTMLElement;
const sprintLink = document.querySelector('.header__nav-game-sprint') as HTMLElement;
const audioCallLink = document.querySelector('.header__nav-game-audiocall') as HTMLElement;
const wordListLink = document.querySelector('.header__nav-learn-wordlist') as HTMLElement;
audioCallLink.onclick = () => audioCallGame.renderAudioCall();
wordListLink.onclick = () => page.render();
sprintLink.onclick = () => sprintGame.starting();
authLink.onclick = () => auth.render();
const page = new WordListPage();
page.render();
