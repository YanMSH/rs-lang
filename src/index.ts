import './global.css';

import WordListPage from './pages/wordlist/wordlist-page';
import AuthPage from './pages/auth/auth-page';
import { SprintGameApp } from './core/components/sprint-game/app/sprint-game-app';
// import App from './core/components/app/app';

// const app = new App();
const auth = new AuthPage();
const sprintGame = new SprintGameApp();

const authLink = document.querySelector('.header__nav-auth') as HTMLElement;
const sprintLink = document.querySelector('.header__nav-game-sprint') as HTMLElement;
const wordListLink = document.querySelector('.header__nav-learn-wordlist') as HTMLElement;
wordListLink.onclick = () => page.render();
sprintLink.onclick = () => sprintGame.starting();
authLink.onclick = () => {
    auth.render();
};
const page = new WordListPage();
page.render();
