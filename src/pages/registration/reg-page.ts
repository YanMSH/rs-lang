import Loader from '../../core/components/loader/loader';
import AuthTools from '../../core/components/service/auth/auth-tools';
import { emailIsValid, nameIsValid, passIsValid } from '../../core/components/service/validation/validation';
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
        <div class="form-container">
            <form class="reg__form">
            <div class="form__name form__field">
                    <label for="form__input-name">Имя</label>
                <input type="text" id="form__input-name">
                </div>
                <div class="form__email form__field">
                    <label for="form__input-email">E-mail</label>
                <input type="email" id="form__input-email">
                </div>
                <div class="form__pass form__field">
                    <label for="form__input-pass">Пароль</label>
                <input type="password" id="form__input-pass">
                </div>
                <button type="submit" class="reg__submit">Зарегистрироваться</button>
            </form>
        </div>
        `;

        const regForm = document.querySelector('.reg__form') as HTMLElement;
        const nameInput = regForm.querySelector('#form__input-name') as HTMLInputElement;
        const emailInput = regForm.querySelector('#form__input-email') as HTMLInputElement;
        const passInput = regForm.querySelector('#form__input-pass') as HTMLInputElement;

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
            return nameIsValid(nameInput) && emailIsValid(emailInput) && passIsValid(passInput);
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
                const regResponse = await this.auth.createUser(regData);
                //DELETE BEFORE RELEASE
                showErrorMessage(regResponse.id);
            }
        };

        regForm.onsubmit = formHandler;
        emailInput.oninput = uncolorizeInput;
        passInput.oninput = uncolorizeInput;
        nameInput.oninput = uncolorizeInput;
    }
}
