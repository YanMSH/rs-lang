import { DataStat, TBWords } from '../../core/types/controller-types';
import TextbookController from '../textbook/textbook-controller';

export default class MainPageTemplates {
    tbController: TextbookController;
    statData: Promise<DataStat>;
    constructor() {
        this.tbController = new TextbookController();
        this.statData = this.tbController.getCurrentStatData();
    }

    async processGameStats() {
        const stats = await this.statData;
        const allWordsFromSprint = Object.keys(stats.sprint).length;
        const allWordsFromAudioCall = Object.keys(stats.audioCall).length;
        const rightWordsFromSprint = Object.values(stats.sprint).filter((item) => item.right).length;
        const rightWordsFromAudioCall = Object.values(stats.audioCall).filter((item) => item.right).length;
        const sprintStreak = stats.longSessionSprint;
        const audioCallStreak = stats.longSessionAudio;
        const sprintRightPercentage = (rightWordsFromSprint / allWordsFromSprint) * 100;
        const audioCallRightPercentage = (rightWordsFromAudioCall / allWordsFromAudioCall) * 100;
        const rightAnswers =
            (rightWordsFromAudioCall ? rightWordsFromAudioCall : 0) + (rightWordsFromSprint ? rightWordsFromSprint : 0);
        const allAnswers =
            (allWordsFromSprint ? allWordsFromSprint : 0) + (allWordsFromAudioCall ? allWordsFromAudioCall : 0);
        return {
            percentOfRightAnswers: ((rightAnswers / allAnswers) * 100).toFixed(0),
            longestStreak: Math.max(sprintStreak, audioCallStreak),
            sprintStreak: sprintStreak,
            audioCallStreak: audioCallStreak,
            newWordsFromSprint: allWordsFromSprint,
            newWordsFromAudioCall: allWordsFromAudioCall,
            sprintRightPercentage: sprintRightPercentage ? sprintRightPercentage.toFixed(0) : 0,
            audioCallRightPercentage: audioCallRightPercentage ? audioCallRightPercentage.toFixed(0) : 0,
        };
    }

    private async getTextbookStats(): Promise<TBWords | undefined> {
        return await this.tbController.getTextbookData();
    }
    private async getNewWordsStats(fieldName: 'new' | 'learned' | 'hard'): Promise<number> {
        const wordsAmount = ((await this.getTextbookStats()) as TBWords)[fieldName];
        return wordsAmount ? wordsAmount : 0;
    }

    buildWelcomePage() {
        return `<section class="welcome__banner">
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
    }

    async buildMainPage() {
        return `<section class="main-page">
<div class="main-page__stats main-page-block subcell">
    <div class="stats__short cell-small">
        <div class="cell__title main-stats-title">Слова:</div>
        <div class="stats__short-words">
            <div class="words__item words__item-new">
                <div class="words__number">${await this.getNewWordsStats('new')}</div>
                <div class="words__word">новых</div>
            </div>
            <div class="words__item words__item-learned">
                <div class="words__number">${await this.getNewWordsStats('learned')}</div>
                <div class="words__word">изученных</div>
            </div>
            <div class="words__item words__item-hard">
                <div class="words__number">${await this.getNewWordsStats('hard')}</div>
                <div class="words__word">сложных</div>
            </div>
        </div>
        <div class="cell__title main-stats-title stats__short-answers">Ответы:</div>
        <div class="stats__short-words stats__short-answers-container">
            <div class="words__item words__item-hard">
                <div class="words__number">${(await this.processGameStats()).percentOfRightAnswers}%</div>
                <div class="words__word">правильных</div>
            </div>
            <div class="words__item words__item-hard">
                <div class="words__number">${(await this.processGameStats()).longestStreak}</div>
                <div class="words__word">подряд</div>
            </div>
        </div>
    </div>
    <div class="stats__long cell-small">
        <div class="cell__title main-stats-title">Долгосрочная статистика:
        </div>
        <img src="../../assets/svg/stat-pic.svg" class="cell__pic stats-long__pic"></div>
</div>
<div class="main-page__textbook main-page-block cell-big">
    <div class="cell__title main-page__textbook-title">Учебник</div>
    <div class="textbook__words-data cell__list">
        <div class="textbook__words-all textbook__words cell__list-item">3600 слов</div>
        <div class="textbook__words-learned textbook__words cell__list-item">${await this.tbController.getAmountOfLearnedWords()} изученных слов</div>
        <div class="textbook__words-hard textbook__words cell__list-item">${await this.tbController.getAmountOfHardWords()} сложных слов</div>
        <div class="textbook__words-learned textbook__words cell__list-item">${(
            (((await this.tbController.getAmountOfLearnedWords()) as number) / 3600) *
            100
        ).toFixed(2)}% учебника пройдено</div>
    </div>
    <img src="../../assets/svg/book-pic.svg" alt="" class="textbook__words-pic" />
</div>
<div class="main-page__games main-page-block subcell">
    <div class="games__sprint cell-small">
        <div class="cell__title main-games-sprint-title">Спринт</div>
        <div class="cell__container sprint__container">
            <img src="../../assets/svg/sprint-pic.svg" alt="" class="cell__pic games__sprint-pic" />
            <div class="cell__list games__sprint-list">
                <div class="cell__list-item">${(await this.processGameStats()).newWordsFromSprint} новых слов</div>
                <div class="cell__list-item">${
                    (await this.processGameStats()).sprintRightPercentage
                }% правильных ответов</div>
                <div class="cell__list-item">${
                    (await this.processGameStats()).sprintStreak
                } правильных ответов подряд</div>
            </div>
        </div>
    </div>
    <div class="games__audiocall cell-small">
        <div class="cell__title main-games-audiocall-title">Аудио-вызов</div>
        <div class="cell__container audiocall__container">
            <div class="cell__list audiocall-list">
                <div class="cell__list-item">${(await this.processGameStats()).newWordsFromAudioCall} новых слов</div>
                <div class="cell__list-item">${
                    (await this.processGameStats()).audioCallRightPercentage
                }% правильных ответов</div>
                <div class="cell__list-item">${
                    (await this.processGameStats()).audioCallStreak
                } правильных ответов подряд</div>
            </div>
            <img src="../../assets/svg/audiocall-pic.svg" alt="" class="cell__pic games__audiocall-pic" />
    </div>
</div>
</section>`;
    }
}
