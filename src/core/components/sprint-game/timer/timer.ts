import './timer.css';
import { fullDashArray, warningThreshold, alertThreshold, timeLimit } from '../../../components/../constants/timer-const';
import { ColorCodes } from '../../../types/timer-types';

export class Timer {
    colorCodes: ColorCodes
    remainingPathColor: string
    timeLeft: number
    timerInterval: number | undefined
    constructor() {
        (this.colorCodes = {
            info: {
                color: 'purple',
            },
            warning: {
                color: 'yellow',
                threshold: warningThreshold,
            },
            alert: {
                color: 'red',
                threshold: alertThreshold,
            },
        }),
        (this.remainingPathColor = this.colorCodes.info.color),
        (this.timeLeft = timeLimit),
        (this.timerInterval = 0);
    }
    start() {
        this.renderTimer();
        this.startTimer();
    }
    onTimesUp() {
        clearInterval(this.timerInterval);
    }

    startTimer() {
        let timePassed = 0;
        const timerLabel = document.getElementById('base-timer-label') as HTMLElement;
        this.timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            this.timeLeft = timeLimit - timePassed;
            timerLabel.innerHTML = this.formatTime(this.timeLeft);
            this.setCircleDasharray();
            this.setRemainingPathColor(this.timeLeft);

            if (this.timeLeft === 0) {
                this.onTimesUp();
            }
        }, 1000);
    }

    formatTime(time: number) {
        let seconds = time % 60;

        if (seconds < 10 && seconds !== 0) {
            seconds = Number(`0${seconds}`);
        } else if (seconds === 0) {
            seconds = Number(`${time}`);
        }

        return `${seconds}`;
    }

    renderTimer() {
        const timer = document.querySelector('.timer') as HTMLElement;
        timer.innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${this.remainingPathColor}"
        d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
        "
        ></path>
        </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${this.formatTime(this.timeLeft)}</span>
    </div>
    `;
    }

    setRemainingPathColor(timeLeft: number) {
        const { alert, warning, info } = this.colorCodes;
        const baseTimer = document.getElementById('base-timer-path-remaining') as HTMLElement;
        if (timeLeft <= alert.threshold) {
            baseTimer.classList.remove(warning.color);
            baseTimer.classList.add(alert.color);
        } else if (this.timeLeft <= warning.threshold) {
            baseTimer.classList.remove(info.color);
            baseTimer.classList.add(warning.color);
        }
    }

    calculateTimeFraction() {
        const rawTimeFraction = this.timeLeft / timeLimit;
        return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
    }

    setCircleDasharray() {
        const baseTimer = document.getElementById('base-timer-path-remaining') as HTMLElement;
        const circleDasharray = `${(this.calculateTimeFraction() * fullDashArray).toFixed(0)} 283`;
        baseTimer.setAttribute('stroke-dasharray', circleDasharray);
    }
}
