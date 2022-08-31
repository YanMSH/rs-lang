import Loader from '../../core/components/loader/loader';
import AuthTools from '../../core/components/service/auth/auth-tools';
import Storage from '../../core/components/service/storage/storage';
import { emailIsValid, passIsValid } from '../../core/components/service/validation/validation';
import { AuthMessages } from '../../core/constants/loader-const';
import RegPage from '../registration/reg-page';
import './auth.css';

export default class AuthPage {
    load: Loader;
    store: Storage;
    regPage: RegPage;
    auth: AuthTools;
    constructor() {
        this.load = new Loader();
        this.store = new Storage();
        this.regPage = new RegPage();
        this.auth = new AuthTools();
    }
    public render() {
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <div class="auth__form-container">
        <h2 class="auth__title">Вход</h2>
            <form class="auth__form">
                <div class="form__email">
                    
                <input type="email" id="form__input-email" placeholder="E-mail" class="form__input">
                </div>
                <div class="form__pass">
                    
                <input type="password" id="form__input-pass" placeholder="Пароль" class="form__input">
                </div>
                <button type="submit" class="auth__submit form__button">Войти</button>
            </form>
            <p class="reg__hint">Нет аккаунта? <a class="reg__link" href="#">Зарегистрируйтесь!</a></p>
        </div>
        `;

        const authForm = document.querySelector('.auth__form') as HTMLElement;
        const formContainer = document.querySelector('.auth__form-container') as HTMLElement;
        const emailInput = authForm.querySelector('#form__input-email') as HTMLInputElement;
        const passInput = authForm.querySelector('#form__input-pass') as HTMLInputElement;
        const regLink = document.querySelector('.reg__link') as HTMLElement;
        regLink.onclick = () => {
            this.regPage.render();
        };
        const uncolorizeInput = (e: Event) => {
            (e.target as HTMLElement).classList.remove('invalid');
        };

        const inputsAreValid = (): boolean => {
            if (!emailIsValid(emailInput)) {
                emailInput.classList.add('invalid');
            }
            if (!passIsValid(passInput)) {
                passInput.classList.add('invalid');
            }
            return emailIsValid(emailInput) && passIsValid(passInput);
        };

        const showErrorMessage = (responseMessage: string) => {
            const message = document.createElement('p');
            message.classList.add('error-message');
            if (responseMessage === AuthMessages.success) {
                message.innerText = 'Вы успешно вошли';
            } else if (responseMessage === AuthMessages.notFound) {
                message.innerText = 'Пользователь не найден';
            } else if (responseMessage === AuthMessages.wrongPass) {
                message.innerText = 'Неправильный e-mail или пароль';
            } else {
                message.innerText = 'Неизвестная ошибка. Попробуйте снова';
            }
            formContainer.append(message);
        };

        const formHandler = async (e: Event) => {
            e.preventDefault();
            const previousError = formContainer.querySelector('.error-message');
            if (previousError !== null) {
                formContainer.removeChild(previousError);
            }
            const authData = {
                email: emailInput.value,
                password: passInput.value,
            };
            if (inputsAreValid()) {
                const authResponse = await this.auth.authUser(authData);
                if (authResponse.message === AuthMessages.success) {
                    this.store.set('user', authResponse);
                    this.store.set('auth', true);
                    showErrorMessage(authResponse.message);
                } else {
                    showErrorMessage(authResponse.message);
                }
            }
        };

        authForm.onsubmit = formHandler;
        emailInput.oninput = uncolorizeInput;
        passInput.oninput = uncolorizeInput;
    }
}
