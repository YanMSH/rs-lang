import StatisticView from '../statistic-view/statistic-view';
import AuthPage from '../../auth/auth-page';
import Loader from '../../../core/components/loader/loader';
import Storage from '../../../core/components/service/storage/storage';
import { Statistic } from '../../../core/types/loader-types';
import { NumStat } from '../../../core/types/controller-types';
import { ResponseAuth } from '../../../core/types/loader-types';

export default class StatisticController {
    public statistic: StatisticView;
    public loader: Loader;
    public storage: Storage;
    public auth: AuthPage;
    public preloader: HTMLImageElement;

    constructor() {
        this.statistic = new StatisticView();
        this.loader = new Loader();
        this.storage = new Storage();
        this.auth = new AuthPage();
        this.preloader = this.createPreloader();
    }

    async getNewWordsToday() {
        const obj: NumStat | Record<string, never> = {};
        const arr: number[] = [];
        const date = new Date();
        const year = (date.getFullYear() > 9) ? date.getFullYear() : `0${date.getFullYear()}`;
      const month = (date.getMonth() > 9) ? date.getMonth() : `0${date.getMonth()}`;
      const day = (date.getDate() > 9) ? date.getDate() : `0${date.getDate()}`;
        const today = `${day}.${month}.${year}`;
        const rightAudio = (await this.getRightAudioAnswers()) as NumStat;
        const mistakesAudio = (await this.getMistakesAudioAnswers()) as NumStat;
        const rightSprint = (await this.getRightSprintAnswers()) as NumStat;
        const mistakesSprint = (await this.getMistakesSprintAnswers()) as NumStat;
        let rightAnsw = (Number(rightAudio[today]) + Number(rightSprint[today])) as number;
        const mistakesAnsw = (Number(mistakesAudio[today]) + Number(mistakesSprint[today])) as number;
        let percent = Math.floor((rightAnsw / (rightAnsw + mistakesAnsw)) * 100);
        if (rightAnsw ) {
          rightAnsw  = rightAnsw ;
        } else {
          rightAnsw  = 0;
        }
        if (percent) {
          percent = percent;
      } else {
          percent = 0;
      }
        arr.push(rightAnsw, percent);
        arr.push;
        obj[today] = arr;
        return obj;
    }

    async getRightAudioAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let right = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const audio = stat[keys[i]].audioCall;
            if (audio) {
                const audioKeys = Object.keys(audio);
                for (let m = 0; m < audioKeys.length; m += 1) {
                    if (audio[audioKeys[m]].right) {
                        right += audio[audioKeys[m]].right;
                    }
                }
            }
            obj[keys[i]] = right;
            right = 0;
        }
        return obj;
    }
    async getLongSessionAudioCall() {
      const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
      const keys = Object.keys(stat);
        const obj: NumStat = {};
        let long = 0;
        for (let i = 0; i < keys.length; i += 1) {
          long = stat[keys[i]].longSessionAudio;
          obj[keys[i]] = long;
          long = 0;
        }
        return obj;
    }
    async getLongSessionSprint() {
      const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
      const keys = Object.keys(stat);
        const obj: NumStat = {};
        let long = 0;
        for (let i = 0; i < keys.length; i += 1) {
          long = stat[keys[i]].longSessionSprint;
          obj[keys[i]] = long;
          long = 0;
        }
        return obj;
    }
    async getRightSprintAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let right = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const sprintGame = stat[keys[i]].sprint;
            if (sprintGame) {
                const sprintKeys = Object.keys(sprintGame);
                for (let m = 0; m < sprintKeys.length; m += 1) {
                    if (sprintGame[sprintKeys[m]].right) {
                        right += sprintGame[sprintKeys[m]].right;
                    }
                }
            }
            obj[keys[i]] = right;
            right = 0;
        }
        return obj;
    }

    async getMistakesAudioAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let mistakes = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const audio = stat[keys[i]].audioCall;
            if (audio) {
                const audioKeys = Object.keys(audio);
                for (let m = 0; m < audioKeys.length; m += 1) {
                    if (audio[audioKeys[m]].mistakes) {
                        mistakes += audio[audioKeys[m]].mistakes;
                    }
                }
            }
            obj[keys[i]] = mistakes;
            mistakes = 0;
        }
        return obj;
    }

    async getMistakesSprintAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let mistakes = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const sprint = stat[keys[i]].sprint;
            if (sprint) {
                const sprintKeys = Object.keys(sprint);
                for (let m = 0; m < sprintKeys.length; m += 1) {
                    if (sprint[sprintKeys[m]].mistakes) {
                        mistakes += sprint[sprintKeys[m]].mistakes;
                    }
                }
            }
            obj[keys[i]] = mistakes;
            mistakes = 0;
        }
        return obj;
    }

    async getData() {
        return {
            rightDayWords: await this.getNewWordsToday(),
            rightAudio: await this.getRightAudioAnswers(),
            mistakesAudio: await this.getMistakesAudioAnswers(),
            rightSprint: await this.getRightSprintAnswers(),
            mistakesSprint: await this.getMistakesSprintAnswers(),
            longSessionAudio: await this.getLongSessionAudioCall(),
            longSessionSprint: await this.getLongSessionSprint(),
        };
    }
    async render() {
        this.addPreloader();
        const user = this.storage.get('user') as ResponseAuth;
        if (user) {
            this.storage.set('statistic', JSON.stringify(await this.getData()));
            this.statistic.renderStatisticPage(await this.getData());
        } else {
            const main = document.querySelector('main') as HTMLElement;
            main.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.classList.add('no-user');
            wrapper.innerHTML = `
          <span class = "no-user-title">Внимание! Статистика доступна только зарегистрированным пользователям!</span>
          <span class = "reg-user">Желаете зарегистрироваться?</span>
          <button class = "auth-statistic">Зарегистрироваться</button>
        `;
            main.append(wrapper);
            const authLink = document.querySelector('.auth-statistic') as HTMLElement;
            authLink.onclick = () => this.auth.render();
        }
    }
    createPreloader() {
        const statusMessage = document.createElement('img');
        statusMessage.classList.add('status');
        statusMessage.src = '../../../assets/svg/spinner1.svg';
        statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
        return statusMessage;
    }
    addPreloader() {
        const main = document.querySelector('main') as HTMLElement;
        main.textContent = '';
        main.append(this.preloader);
    }
}
