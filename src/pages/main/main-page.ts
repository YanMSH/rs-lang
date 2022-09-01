export default class MainPage {
    welcomePageTemplate: string;
    constructor() {
        this.welcomePageTemplate = `<section class="welcome__banner">
        <div class="welcome__text-block welcome__banner-half">
            <div class="welcome__text-title block__title">Приветствую!</div>
            <div class="welcome__text-desc">
                Это наше приложение для изучения английского языка rs-Lang! В rs-Lang есть:
                <ul class="welcome__text-list">
                    <li class="welcome__text-list-item">Удобный учебник</li>
                    <li class="welcome__text-list-item">Две мини игры: "Спринт" и "Аудио-вызов"</li>
                    <li class="welcome__text-list-item">Статистика изученных и сложных слов</li>
                </ul>
            </div>
            <button class="welcome__banner-reg-link welcome__banner-btn">Регистрация</button>
        </div>
        <div class="welcome__banner-picture welcome__banner-half">
            <div class="welcome__banner-picture-title">Я не нашел картинку!</div>
            <button class="welcome__banner-auth-link welcome__banner-btn">Войти</button>
        </div>
    </section>
    <section class="about-us">
        <div class="about-us__title block__title">Наша команда</div>
        <div class="about-us__card-container">
            <div class="about-us__card">
                <div class="card__pic"></div>
                <div class="card__text">
                    <span class="card__text-name">Это я</span>: тимлид. За мной архитектура и UI-дизайн
                    приложения. Весь функционал учебника. Создание большинства методов для обращения к бекенду.
                    Регистрация, аутентификация.
                </div>
            </div>
            <div class="about-us__card">
                <div class="card__pic"></div>
                <div class="card__text">
                    <span class="card__text-name">Сергей</span>: статистика. Игра "Аудиовызов".
                </div>
            </div>
            <div class="about-us__card">
                <div class="card__pic"></div>
                <div class="card__text"><span class="card__text-name">Кристина</span>: игра "Спринт".</div>
            </div>
            <div class="about-us__card card__mentor">
                <div class="card__pic"></div>
                <div class="card__text">
                    <span class="card__text-name">Таня</span>: ментор. Советы по организации командной работы.
                    Помощь с выбором технологий. Подсказки по архитектуре приложения.
                </div>
            </div>
        </div>
    </section>`;
    }
    render() {
        const app = document.querySelector('.app') as HTMLElement;
        app.innerHTML = ``;
    }
}
