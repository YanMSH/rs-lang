import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import './auth.css';

export default class AuthPage {
    load: Loader;
    store: Storage;
    constructor() {
        this.load = new Loader();
        this.store = new Storage();
    }
    render() {
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <div class="auth__form-container">
            <form class="auth__form">
                <div class="form__email">
                    <label for="form__input-email">E-mail</label>
                <input type="email" id="form__input-email">
                </div>
                <div class="form__pass">
                    <label for="form__input-pass">Пароль</label>
                <input type="password" id="form__input-pass">
                </div>
                <button type="submit" class="auth__submit">Войти</button>
            </form>
            <p>Нет аккаунта? <a href="#">Зарегистрируйтесь!</a></p>
        </div>
        `;
        const authForm = document.querySelector('.auth__form') as HTMLElement;

        authForm.onsubmit = async (e: Event) => {
            e.preventDefault();
            const emailInput = authForm.querySelector('#form__input-email') as HTMLInputElement;
            const passInput = authForm.querySelector('#form__input-pass') as HTMLInputElement;
            const authData = {
                email: emailInput.value,
                password: passInput.value
            }
            console.log(authData);
            const authResponse = await this.load.authUser(authData);
            console.log(authResponse);
            //this.store.set('user', JSON.stringify(authResponse));
            // console.log('token', authResponse.token);
            // console.log('refreshToken', authResponse.refreshToken);

        }
    }
}