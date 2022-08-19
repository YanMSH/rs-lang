import Loader from '../../core/components/loader/loader';
import Storage from '../../core/components/service/storage/storage';
import { emailIsValid, passIsValid } from '../../core/components/service/validation/validation';
import { AuthMessages } from '../../core/constants/loader-const';
import './auth.css';

export default class AuthPage {
    load: Loader;
    store: Storage;
    constructor() {
        this.load = new Loader();
        this.store = new Storage();
    }
    public render() {
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
        const emailInput = authForm.querySelector('#form__input-email') as HTMLInputElement;
        const passInput = authForm.querySelector('#form__input-pass') as HTMLInputElement;

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
            if (responseMessage === AuthMessages.success) {
                return;
            }
            const message = document.createElement('p');
            message.classList.add('error-message');
            if (responseMessage === AuthMessages.notFound) {
                message.innerText = 'Пользователь не найден';
            } else if (responseMessage === AuthMessages.wrongPass) {
                message.innerText = 'Неправильный e-mail или пароль';
            } else {
                message.innerText = 'Неизвестная ошибка. Попробуйте снова';
            }
            authForm.append(message);
        };

        const formHandler = async (e: Event) => {
            e.preventDefault();
            const previousError = authForm.querySelector('.error-message');
            if (previousError !== null) {
                authForm.removeChild(previousError);
            }
            const authData = {
                email: emailInput.value,
                password: passInput.value,
            };
            if (inputsAreValid()) {
                const authResponse = await this.load.authUser(authData);
                //DELETE BEFORE RELEASE
                console.log(authResponse);
                if (authResponse.message === AuthMessages.success) {
                    this.store.set('user', JSON.stringify(authResponse));
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
