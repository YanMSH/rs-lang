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

    constructor() {
        this.statistic = new StatisticView();
        this.loader = new Loader();
        this.storage = new Storage();
        this.auth = new AuthPage();
    }

    async getNewWordsToday() {
      const obj: NumStat | Record<string, never> = {};
      const arr: number[] = [];
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const today = `${day}.${month}.${year}`;
      const rightAudio = await this.getRightAudioAnswers() as NumStat;
      const mistakesAudio = await this.getMistakesAudioAnswers() as NumStat;
      // const rightSprint = await this.getRightSprintAnswers() as NumStat;
      // const mistakesSprint = await this.getMistakesSprintAnswers() as NumStat;
      // const rightAnsw = (rightAudio[today] + rightSprint[today]) as number;
      // const mistakesAnsw = (mistakesAudio[today] + mistakesSprint[today]) as number;
      const rightAnsw = rightAudio[today] as number;
      const mistakesAnsw = mistakesAudio[today] as number;
      const percent = Math.floor(rightAnsw / (rightAnsw + mistakesAnsw) * 100) ; 
      arr.push(rightAnsw, percent);
      arr.push
      obj[today] = arr;

      // obj.today = rightAudio[today] + rightSprint[today]; 
      return obj;
    }

    async getRightAudioAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let right = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const audio = stat[keys[i]].audioCall;
            const audioKeys = Object.keys(audio);
            for (let m = 0; m < audioKeys.length; m += 1) {
                if (audio[audioKeys[m]].right) {
                    right += audio[audioKeys[m]].right;
                }
            }
            obj[keys[i]] = right;
            right = 0;
          }
        return obj;
    }
    async getRightSprintAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let right = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const sprint = stat[keys[i]].sprint;
            const sprintKeys = Object.keys(sprint);
            for (let m = 0; m < sprintKeys.length; m += 1) {
                if (sprint[sprintKeys[m]].right) {
                    right += sprint[sprintKeys[m]].right;
                }
            }
            obj[keys[i]] = right;
            right = 0;
          }
        return obj
    }

    async getMistakesAudioAnswers() {
        const stat = ((await this.loader.getStatistic(`statistics`)) as Statistic).optional;
        const keys = Object.keys(stat);
        const obj: NumStat = {};
        let mistakes = 0;
        for (let i = 0; i < keys.length; i += 1) {
            const audio = stat[keys[i]].audioCall;
            const audioKeys = Object.keys(audio);
            for (let m = 0; m < audioKeys.length; m += 1) {
                if (audio[audioKeys[m]].mistakes) {
                    mistakes += audio[audioKeys[m]].mistakes;
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
            const sprintKeys = Object.keys(sprint);
            for (let m = 0; m < sprintKeys.length; m += 1) {
                if (sprint[sprintKeys[m]].mistakes) {
                    mistakes += sprint[sprintKeys[m]].mistakes;
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
        // rightSprint: await this.getRightSprintAnswers(),
        // mistakesSprint: await this.getMistakesSprintAnswers(),
      }
    }
    async render() {
      const user = (this.storage.get('user') as ResponseAuth);
      if (user) {
        console.log(await this.getData());
        this.storage.set('statistic', JSON.stringify(await this.getData()));
        this.statistic.renderStatisticPage(await this.getData());
      } else {
        const main = document.querySelector('main') as HTMLElement;
        main.innerHTML = `
          <span class = "no-user">Внимание! Статистика доступна только зарегистрированным пользователям!</span>
          <span class = "reg-user">Желаете зарегистрироваться?</span>
          <button class = "auth-statistic">Зарегистрироваться</button>
        `;
        const authLink = document.querySelector('.auth-statistic') as HTMLElement;
        authLink.onclick = () => this.auth.render();
      }
    }
}
