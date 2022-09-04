import './statistic-view.css';
import { renderStat, NumStat } from '../../../core/types/controller-types';
import Storage from '../../../core/components/service/storage/storage';
import { ResponseAuth } from '../../../core/types/loader-types';
import { Chart } from 'chart.js';

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
        const audioStat = this.createAudioStatistic(object.rightAudio as NumStat, object.mistakesAudio as NumStat);
        const sprintStat = this.createSprintStatistic(object.rightSprint as NumStat, object.mistakesSprint as NumStat);
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
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const today = `${day}.${month}.${year}`;
        const arr = right[today] as number[];
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
        // const graphWords = this.createGraph(Object.keys(right), a, 'green', 'Words Statistic');
        wordStat.append(wordsBlock);
        return wordStat;
    }

    createAudioStatistic(right: NumStat, mistakes: NumStat) {
        const audioStat = document.createElement('div');
        audioStat.classList.add('words-statistic');
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const today = `${day}.${month}.${year}`;
        const arrRigth = right[today] as number;
        const arrMistakes = mistakes[today] as number;
        const percent = Math.floor(arrRigth / (arrRigth + arrMistakes) * 100) ; 
        const audioBlock = document.createElement('div');
        audioBlock.classList.add('words-statistic-block');
        audioBlock.innerHTML = `
            <span class = "statistic-title">Игра AudioCall: </span>
            <span class = "statistic-title">Статистика новых слов за сегодня (${today}): </span>
            <span class = "statistic-text">Количество новых слов: ${arrRigth}</span>
            <span class = "statistic-text">Количество изученных слов: ${arrRigth}</span>
            <span class = "statistic-text">Процент правильных ответов: ${percent}</span>
        `;
        const a: number[] = [];
        const keys = Object.keys(right);
        for (let i = 0; i < keys.length; i += 1) { 
            const s = right[keys[i]] as number[];
            a.push(s[0]);
        }
        // const graphWords = this.createGraph(Object.keys(right), a, 'green', 'AudioCall Statistic');
        audioStat.append(audioBlock);
        return audioStat;
    }

    createSprintStatistic(right: NumStat, mistakes: NumStat) {
        const sprintStat = document.createElement('div');
        sprintStat.classList.add('words-statistic');
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const today = `${day}.${month}.${year}`;
        const arrRigth = right[today] as number;
        const arrMistakes = mistakes[today] as number;
        const percent = Math.floor(arrRigth / (arrRigth + arrMistakes) * 100) ; 
        const sprintBlock = document.createElement('div');
        sprintBlock.classList.add('words-statistic-block');
        sprintBlock.innerHTML = `
            <span class = "statistic-title">Игра Sprint: </span>
            <span class = "statistic-title">Статистика новых слов за сегодня (${today}): </span>
            <span class = "statistic-text">Количество новых слов: ${arrRigth}</span>
            <span class = "statistic-text">Количество изученных слов: ${arrRigth}</span>
            <span class = "statistic-text">Процент правильных ответов: ${percent}</span>
        `;
        const a: number[] = [];
        const keys = Object.keys(right);
        for (let i = 0; i < keys.length; i += 1) { 
            const s = right[keys[i]] as number[];
            a.push(s[0]);
        }
        // const graphWords = this.createGraph(Object.keys(right), a, 'green', 'Sprint Statistic');
        sprintStat.append(sprintBlock);
        return sprintStat;
    }


    // createGraph(dataArray: string[], data: number[], color: string, label: string) {
    //     const canvas = document.createElement('canvas');
    //     canvas.id = 'MyChart';
    //     canvas.width = 500;
    //     canvas.height = 500;
    //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    //     const myChart = new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: dataArray,
    //             datasets: [
    //                 {
    //                     label: 'Life expectancy',
    //                     data: data,
    //                     backgroundColor: color,
    //                     borderColor: [
    //                         'rgba(216, 27, 96, 1)',
    //                         'rgba(3, 169, 244, 1)',
    //                         'rgba(255, 152, 0, 1)',
    //                         'rgba(29, 233, 182, 1)',
    //                         'rgba(156, 39, 176, 1)',
    //                         'rgba(84, 110, 122, 1)',
    //                     ],
    //                     borderWidth: 1,
    //                 },
    //             ],
    //         },
    //         options: {
    //             legend: {
    //                 display: false,
    //             },
    //             title: {
    //                 display: true,
    //                 text: label,
    //                 position: 'top',
    //                 fontSize: 15,
    //                 padding: 20,
    //             },
    //             scales: {
    //                 yAxes: [
    //                     {
    //                         ticks: {
    //                             min: 0,
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //     });

    //     return canvas;
    // }
}
