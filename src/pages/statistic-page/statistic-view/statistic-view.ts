import './statistic-view.css';
import { renderStat, NumStat } from '../../../core/types/controller-types';
import Storage from '../../../core/components/service/storage/storage';
import { ResponseAuth } from '../../../core/types/loader-types';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default class StatisticView {
    public storage: Storage;
    constructor() {
        this.storage = new Storage();
    }

    renderStatisticPage(object: renderStat) {
        const main = document.querySelector('main') as HTMLElement;
        main.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-statistic');
        const welcome = this.createWelcomeMessage();
        const wordsStat = this.createWordsStatistic(object.rightDayWords as NumStat);
        const audioStat = this.createAudioStatistic(object.rightAudio as NumStat, object.mistakesAudio as NumStat, object.longSessionAudio as NumStat);
        const sprintStat = this.createSprintStatistic(object.rightSprint as NumStat, object.mistakesSprint as NumStat, object.longSessionSprint as NumStat);
        wrapper.append(welcome, wordsStat, audioStat, sprintStat);
        main.append(wrapper);
    }

    createWelcomeMessage() {
        const message = document.createElement('div');
        message.classList.add('message-statistic');
        const user = (this.storage.get('user') as ResponseAuth).name;
        message.innerHTML = `
            <span class = "title-statistic">${user}, приветствую тебя!</span>
            <span class = "sub_title-statistic">На этой странице можно ознакомиться со статистикой изученных слов!</span>
        `;
        return message;
    }

    createWordsStatistic(right: NumStat) {
        const wordStat = document.createElement('div');
        wordStat.classList.add('words-statistic');
        wordStat.classList.add('words-statistic-general');
        const date = new Date();
        const year = (date.getFullYear() > 9) ? date.getFullYear() : `0${date.getFullYear()}`;
        const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = (date.getDate() > 9) ? date.getDate() : `0${date.getDate()}`;
        const today = `${day}.${month}.${year}`;
        let arr = right[today] as number[];
        if (arr) {
            arr = arr;
        } else {
            arr = [0, 0];
        }
        const wordsBlock = document.createElement('div');
        wordsBlock.classList.add('words-statistic-block');
        wordsBlock.innerHTML = `
            <span class = "statistic-title">Статистика новых слов за сегодня (${today}): </span>
            <span class = "statistic-text">Количество новых слов: ${arr[0]}</span>
            <span class = "statistic-text">Количество изученных слов: ${arr[0]}</span>
            <span class = "statistic-text">Процент правильных ответов: ${arr[1]}</span>
        `;
        const a: number[] = [];
        const keys = Object.keys(right);
        for (let i = 0; i < keys.length; i += 1) { 
            const s = right[keys[i]] as number[];
            a.push(s[0]);
        }
        const color = this.getRandomColor();
        const graphWords = this.createGraph(Object.keys(right), a, color, 'Words Statistic');
        wordStat.append(wordsBlock, graphWords);
        return wordStat;
    }

    createAudioStatistic(right: NumStat, mistakes: NumStat, longSession: NumStat) {
        const audioStat = document.createElement('div');
        audioStat.classList.add('words-statistic');
        audioStat.classList.add('words-statistic-audio');
        const date = new Date();
        const year = (date.getFullYear() > 9) ? date.getFullYear() : `0${date.getFullYear()}`;
        const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = (date.getDate() > 9) ? date.getDate() : `0${date.getDate()}`;
        const today = `${day}.${month}.${year}`;
        let arrRight = right[today] as number;
        let session = longSession[today] as number;
        let arrMistakes = mistakes[today] as number;
        let percent = Math.floor(arrRight / (arrRight + arrMistakes) * 100);
        if (session) {
            session = session;
        } else {
            session = 0;
        }
        if (arrRight) {
            arrRight = arrRight;
        } else {
            arrRight = 0;
        }
        if (arrMistakes) {
            arrMistakes = arrMistakes;
        } else {
            arrMistakes = 0;
        }
        if (percent) {
            percent = percent;
        } else {
            percent = 0;
        }
        const audioBlock = document.createElement('div');
        audioBlock.classList.add('words-statistic-block');
        audioBlock.innerHTML = `
            <span class = "statistic-title">Игра AudioCall: </span>
            <span class = "statistic-title">Статистика новых слов за сегодня (${today}): </span>
            <span class = "statistic-text">Количество новых слов: ${arrRight}</span>
            <span class = "statistic-text">Количество изученных слов: ${arrRight}</span>
            <span class = "statistic-text">Процент правильных ответов: ${percent}</span>
            <span class = "statistic-text">Количество правильных ответов подряд: ${session} </span>
        `;
        const a: number[] = [];
        const keys = Object.keys(right);
        for (let i = 0; i < keys.length; i += 1) {
            const s = right[keys[i]] as number;
            a.push(s);
        }
        const color = this.getRandomColor();
        const graphWords = this.createGraph(Object.keys(right), a, color, 'AudioCall Statistic');
        audioStat.append(audioBlock, graphWords);
        return audioStat;
    }

    createSprintStatistic(right: NumStat, mistakes: NumStat, longSession: NumStat) {
        const sprintStat = document.createElement('div');
        sprintStat.classList.add('words-statistic');
        sprintStat.classList.add('words-statistic-sprint');
        const date = new Date();
        const year = (date.getFullYear() > 9) ? date.getFullYear() : `0${date.getFullYear()}`;
        const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = (date.getDate() > 9) ? date.getDate() : `0${date.getDate()}`;
        const today = `${day}.${month}.${year}`;
        let session = longSession[today] as number;
        let arrRigth = right[today] as number;
        let arrMistakes = mistakes[today] as number;
        let percent = Math.floor(arrRigth / (arrRigth + arrMistakes) * 100);
        if (session) {
            session = session;
        } else {
            session = 0;
        }
        if (arrRigth) {
            arrRigth = arrRigth;
        } else {
            arrRigth = 0;
        }
        if (arrMistakes) {
            arrMistakes = arrMistakes;
        } else {
            arrMistakes = 0;
        }
        if (percent) {
            percent = percent;
        } else {
            percent = 0;
        } 
        const sprintBlock = document.createElement('div');
        sprintBlock.classList.add('words-statistic-block');
        sprintBlock.innerHTML = `
            <span class = "statistic-title">Игра Sprint: </span>
            <span class = "statistic-title">Статистика новых слов за сегодня (${today}): </span>
            <span class = "statistic-text">Количество новых слов: ${arrRigth}</span>
            <span class = "statistic-text">Количество изученных слов: ${arrRigth}</span>
            <span class = "statistic-text">Процент правильных ответов: ${percent}</span>
            <span class = "statistic-text">Количество правильных ответов подряд: ${session} </span>
        `;
        const a: number[] = [];
        const keys = Object.keys(right);
        for (let i = 0; i < keys.length; i += 1) { 
            const s = right[keys[i]] as number;
            a.push(s);
        }
        const color = this.getRandomColor();
        const graphWords = this.createGraph(Object.keys(right), a, color, 'Sprint Statistic');
        sprintStat.append(sprintBlock, graphWords);
        return sprintStat;
    }


    createGraph(dataArray: string[], data: number[], color: string, label: string) {
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart';
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataArray,
                datasets: [
                    {
                        label: label,
                        data: data,
                        backgroundColor: color,
                        borderColor: [
                            'rgba(216, 27, 96, 1)',
                            'rgba(3, 169, 244, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(29, 233, 182, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(84, 110, 122, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
        });

        return canvas;
    }
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i += 1) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
