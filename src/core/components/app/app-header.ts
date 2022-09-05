import Storage from '../service/storage/storage';

export default class AppHeader {
    store: Storage;
    constructor() {
        this.store = new Storage();
    }
    toggleLoginLogout() {
        const loginButton = document.querySelector('.header__nav-auth') as HTMLElement;
        const loginText = loginButton.querySelector('.nav-link-text-content') as HTMLSpanElement;
        if (this.store.inStore('auth')) {
            loginText.innerText = 'Выйти';
            loginButton.onclick = () => {
                this.store.remove('auth');
                location.reload();
            };
        }
    }
}
