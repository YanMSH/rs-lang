import Loader from '../../core/components/loader/loader';
import AuthTools from '../../core/components/service/auth/auth-tools';
import {
    emailIsValid,
    nameIsValid,
    passIsConfirmed,
    passIsValid,
} from '../../core/components/service/validation/validation';
import { StatusCodes } from '../../core/constants/loader-const';
import './reg-page.css';

export default class RegPage {
    load: Loader;
    auth: AuthTools;
    constructor() {
        this.auth = new AuthTools();
        this.load = new Loader();
    }
    public render() {
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = `
        <div class="form__container reg__form-container">
        <h2 class="reg__title form__title">Регистрация</h2>
            <form class="reg__form form">
            <div class="form__name form__field">
                <input type="text" id="form__input-name" class="form__input" placeholder="Имя">
                </div>
                <div class="form__email form__field">
                <input type="email" id="form__input-email" class="form__input" placeholder="E-mail">
                </div>
                <div class="form__pass form__field">
                <input type="password" id="form__input-pass" class="form__input" placeholder="Пароль">
                </div>
                <div class="form__pass form__field">
                <input type="password" id="form__input-pass-confirm" class="form__input" placeholder="Подтверждение">
                </div>
                <button type="submit" class="reg__submit form__button">Зарегистрироваться</button>
            </form>
        </div>
        `;

        const regForm = document.querySelector('.reg__form') as HTMLElement;
        const nameInput = regForm.querySelector('#form__input-name') as HTMLInputElement;
        const emailInput = regForm.querySelector('#form__input-email') as HTMLInputElement;
        const passInput = regForm.querySelector('#form__input-pass') as HTMLInputElement;
        const passConfirmInput = regForm.querySelector('#form__input-pass-confirm') as HTMLInputElement;
        const inputs = document.querySelectorAll('input');
        const uncolorizeInput = (e: Event) => {
            (e.target as HTMLElement).classList.remove('invalid');
        };

        const inputsAreValid = (): boolean => {
            if (!nameIsValid(nameInput)) {
                nameInput.classList.add('invalid');
            }
            if (!emailIsValid(emailInput)) {
                emailInput.classList.add('invalid');
            }
            if (!passIsValid(passInput)) {
                passInput.classList.add('invalid');
            }
            if (!passIsConfirmed(passInput, passConfirmInput)) {
                passInput.classList.add('invalid');
                passConfirmInput.classList.add('invalid');
            }
            return (
                nameIsValid(nameInput) &&
                emailIsValid(emailInput) &&
                passIsValid(passInput) &&
                passIsConfirmed(passInput, passConfirmInput)
            );
        };

        const showErrorMessage = (id: string) => {
            const message = document.createElement('p');
            message.classList.add('error-message');
            if (isNaN(Number(id))) {
                message.innerText = 'Вы успешно зарегистрировались';
            } else if (Number(id) === StatusCodes.expectationFailed) {
                message.innerText = 'Пользователь с таким e-mail уже зарегистрирован';
            } else if (Number(id) === StatusCodes.incorrectAuthInput) {
                message.innerText = 'Ошибка ввода e-mail или пароля. Длина пароля должна быть не менее 8-ми символов';
            } else {
                message.innerText = 'Неизвестная ошибка. Попробуйте снова';
            }
            regForm.append(message);
        };

        const formHandler = async (e: Event) => {
            e.preventDefault();
            const previousError = regForm.querySelector('.error-message');
            if (previousError !== null) {
                regForm.removeChild(previousError);
            }
            const regData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passInput.value,
            };
            if (inputsAreValid()) {
                inputs.forEach((input) => input.classList.remove('invalid'));
                const regResponse = await this.auth.createUser(regData);
                showErrorMessage(regResponse.id);
            }
        };

        regForm.onsubmit = formHandler;
        emailInput.oninput = uncolorizeInput;
        passInput.oninput = uncolorizeInput;
        passConfirmInput.oninput = uncolorizeInput;
        nameInput.oninput = uncolorizeInput;
    }
}
