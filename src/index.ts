import './global.css';
import WordListPage from './pages/wordlist/wordlist-page';
import AuthPage from './pages/auth/auth-page';
// import App from './core/components/app/app';

// const app = new App();
const auth = new AuthPage();
const authLink = document.querySelector('.header__nav-auth') as HTMLElement;
authLink.onclick = () => { auth.render() }
const page = new WordListPage();
page.render();
