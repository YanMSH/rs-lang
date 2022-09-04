export const welcomePageTemplate = `<section class="welcome__banner">
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
            <span class="card__text-name">Ян</span>: разработчик, тимлид. Разработал архитектуру и UI-дизайн
            приложения. Выполнил страницы: главная, учебник, регистрация, аутентификация.
        </div>
    </div>
    <div class="about-us__card">
        <div class="card__pic"></div>
        <div class="card__text">
            <span class="card__text-name">Сергей</span>: разработчик. Продумал и реализовал сбор статистики в приложении. Создал игру "Аудиовызов".
        </div>
    </div>
    <div class="about-us__card">
        <div class="card__pic"></div>
        <div class="card__text"><span class="card__text-name">Кристина</span>: разработчик. Сделала игру "Спринт".</div>
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
export const mainPageTemplate = `<section class="main-page">
<div class="main-page__stats main-page-block subcell">
    <div class="stats__short cell-small">
        <div class="cell__title main-stats-title">Слова:</div>
        <div class="stats__short-words">
            <div class="words__item words__item-new">
                <div class="words__number">99</div>
                <div class="words__word">новых</div>
            </div>
            <div class="words__item words__item-learned">
                <div class="words__number">54</div>
                <div class="words__word">изученных</div>
            </div>
            <div class="words__item words__item-hard">
                <div class="words__number">45</div>
                <div class="words__word">сложных</div>
            </div>
        </div>
        <div class="cell__title main-stats-title stats__short-answers">Ответы:</div>
        <div class="stats__short-words stats__short-answers-container">
            <div class="words__item words__item-hard">
                <div class="words__number">55%</div>
                <div class="words__word">правильных</div>
            </div>
            <div class="words__item words__item-hard">
                <div class="words__number">12</div>
                <div class="words__word">подряд</div>
            </div>
        </div>
    </div>
    <div class="stats__long cell-small">
        <div class="cell__title main-stats-title">Долгосрочная стата:</div>
    </div>
</div>
<div class="main-page__textbook main-page-block cell-big">
    <div class="cell__title main-page__textbook-title">Учебник</div>
    <div class="textbook__words-data cell__list">
        <div class="textbook__words-all textbook__words cell__list-item">3600 слов</div>
        <div class="textbook__words-learned textbook__words cell__list-item">115 изученных слов</div>
        <div class="textbook__words-hard textbook__words cell__list-item">87 сложных слов</div>
    </div>
    <img src="../../assets/svg/book-pic.svg" alt="" class="textbook__words-pic" />
</div>
<div class="main-page__games main-page-block subcell">
    <div class="games__sprint cell-small">
        <div class="cell__title main-games-sprint-title">Спринт</div>
        <div class="cell__container sprint__container">
            <img src="../../assets/svg/sprint-pic.svg" alt="" class="cell__pic games__sprint-pic" />
            <div class="cell__list games__sprint-list">
                <div class="cell__list-item">12 новых слов</div>
                <div class="cell__list-item">78% правильных ответов</div>
                <div class="cell__list-item">11 правильных ответов подряд</div>
            </div>
        </div>
    </div>
    <div class="games__audiocall cell-small">
        <div class="cell__title main-games-audiocall-title">Аудио-вызов</div>
        <div class="cell__container audiocall__container">
            <div class="cell__list audiocall-list">
                <div class="cell__list-item">35 новых слов</div>
                <div class="cell__list-item">63% правильных ответов</div>
                <div class="cell__list-item">15 правильных ответов подряд</div>
            </div>
            <img src="../../assets/svg/audiocall-pic.svg" alt="" class="cell__pic games__audiocall-pic" />
    </div>
</div>
</section>`;
