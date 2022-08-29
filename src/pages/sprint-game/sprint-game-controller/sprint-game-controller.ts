import { SprintGameView } from '../sprint-game-view/sprint-game-view';
import LevelPage from '../sprint-game-view/level-page';
import { sprintLevelMessage } from '../../../core/constants/level-const';
import Storage from '../../../core/components/service/storage/storage';
import Loader from '../../../core/components/loader/loader';
import { circleActiveBackground, circleNoActiveBackground, maxVolume, minVolume } from "../../../core/constants/sprint-game-const";
import { initialPoints, ratioOne, ratioTwo, ratioThree, maxCountCircle, maxOffset } from "../../../core/constants/sprint-game-const";
export class SprintGameController {
  private sprintGameView: SprintGameView;
  private levelPage: LevelPage;
  private sprintLevelMessage: string;
  private storage: Storage;
  private loader: Loader;
  private audio: HTMLAudioElement;
  private circleActiveBackground: string;
  private circleNoActiveBackground: string;
  private minVolume: number;
  private maxVolume: number;
  private initialPoints: number;
  private ratioOne: number;
  private ratioTwo: number;
  private ratioThree: number;
  private maxCountCircle: number;
  private maxOffset: number;

  constructor() {
    this.sprintGameView = new SprintGameView();
    this.levelPage = new LevelPage();
    this.sprintLevelMessage = sprintLevelMessage;
    this.storage = new Storage();
    this.loader = new Loader();
    this.audio = new Audio();
    this.circleActiveBackground = circleActiveBackground;
    this.circleNoActiveBackground = circleNoActiveBackground;
    this.minVolume = minVolume;
    this.maxVolume = maxVolume;
    this.initialPoints = initialPoints;
    this.ratioOne = ratioOne;
    this.ratioTwo = ratioTwo;
    this.ratioThree = ratioThree;
    this.maxCountCircle = maxCountCircle;
    this.maxOffset = maxOffset;
  }

  public render() {
    this.chooseLevel();
  }

  private chooseLevel() {
    this.levelPage.renderLevelPage('wrapper-sprint', this.sprintLevelMessage);
    const level = document.querySelectorAll('.level');
    level.forEach((elem) => {
      elem.addEventListener('click', async () => {
        const buttonLevel = Number(elem.getAttribute('data-level'));
        this.storage.set('group', buttonLevel - 1);
        this.startGame();
        this.changeWords();
        this.setCountCircleToLocalStorage(0); 
        this.setRightAnswerCountToStorage(0);
      });
    });
  }

  private async changeWords() {
      const group = this.storage.get('group') as number;
      const words = await this.fillWords(group);
      const wrongAnswerBtn = document.querySelector('.wrong-answer-btn') as HTMLButtonElement;
      const rightAnswerBtn = document.querySelector('.right-answer-btn') as HTMLButtonElement;
      const sumPoint = document.querySelector('.point-count') as HTMLSpanElement;
      const point = Number(sumPoint.textContent);
      let offset = 0;
      if (wrongAnswerBtn) {
        wrongAnswerBtn.addEventListener('click', () => {
          const rightAnswerCount = this.storage.get('rightAnswerCount') as number;
          const countCircle = this.storage.get('countCircle') as number;
          this.checkWrongAnswer(point, countCircle, rightAnswerCount);
          if (offset < this.maxOffset) {
            const lastRandomNumber = words.length / 4 - 1 + Number(`${offset}`);
            const firstRandomNumber = 0 + Number(`${offset}`);
            const firstIndexOfWord = this.getRandomNumber(firstRandomNumber, lastRandomNumber);
            const secondIndexOfWord = this.getRandomNumber(firstRandomNumber, lastRandomNumber);
            console.log(firstIndexOfWord, secondIndexOfWord);
            this.storage.set('firstIndexOfWord', firstIndexOfWord);
            this.storage.set('secondIndexOfWord', secondIndexOfWord);
            this.sprintGameView.clickOnTheAnswerButton(words[firstIndexOfWord].word, words[secondIndexOfWord].wordTranslate);
            setTimeout(this.changeOkUsualIcon, 300);
            setTimeout(this.changeUsualBorderOfContainer, 2000);
            offset += 1;
          } else {
            offset = 0;
          }
        });
      }
      if (rightAnswerBtn) {
        rightAnswerBtn.addEventListener('click', () => {
          if (offset < this.maxOffset) {
            const rightAnswerCount = this.storage.get('rightAnswerCount') as number;
            const countCircle = this.storage.get('countCircle') as number;
            this.checkRightAnswer(point, countCircle, rightAnswerCount);
            const lastRandomNumber = words.length / 4 - 1 + Number(`${offset}`);
            const firstRandomNumber = 0 + Number(`${offset}`);
            const firstIndexOfWord = this.getRandomNumber(firstRandomNumber, lastRandomNumber);
            const secondIndexOfWord = this.getRandomNumber(firstRandomNumber, lastRandomNumber);
            this.storage.set('firstIndexOfWord', firstIndexOfWord);
            this.storage.set('secondIndexOfWord', secondIndexOfWord);
            this.sprintGameView.clickOnTheAnswerButton(words[firstIndexOfWord].word, words[secondIndexOfWord].wordTranslate);
            setTimeout(this.changeOkUsualIcon, 300);
            setTimeout(this.changeUsualBorderOfContainer, 2000);
            offset += 1;
        } else {
            offset = 0;
        } 
      });
    }
  }

  private checkRightAnswer(point: number, countCircle: number, rightAnswerCount: number) {
    const prevFirstIndexOfWord =  this.storage.get('firstIndexOfWord') as number;
    const prevSecondIndexOfWord = this.storage.get('secondIndexOfWord') as number;
    const pointCount = document.querySelector('.point-count-text') as HTMLSpanElement;
    const sumOfCountPoint = Number(pointCount.textContent);
    if (prevFirstIndexOfWord === prevSecondIndexOfWord) {
      this.countPointsWithCorrectAnswer(rightAnswerCount, sumOfCountPoint, point, countCircle);
    } else {
      this.countPointsWithIncorrectAnswer(rightAnswerCount, countCircle);
    }
  }

  private checkWrongAnswer(point: number, countCircle: number, rightAnswerCount: number) {
    const prevFirstIndexOfWord =  this.storage.get('firstIndexOfWord') as number;
    const prevSecondIndexOfWord = this.storage.get('secondIndexOfWord') as number;
    const pointCount = document.querySelector('.point-count-text') as HTMLSpanElement;
    const sumOfCountPoint = Number(pointCount.textContent);
    if (prevFirstIndexOfWord === prevSecondIndexOfWord) {
      this.countPointsWithIncorrectAnswer(rightAnswerCount, countCircle);
    } else {
      this.countPointsWithCorrectAnswer(rightAnswerCount, sumOfCountPoint, point, countCircle);
    }
  }

  private countPointsWithCorrectAnswer(rightAnswerCount: number, sumOfCountPoint: number, point: number, countCircle: number) {
    rightAnswerCount += this.ratioOne;
      if (rightAnswerCount >= this.ratioTwo && rightAnswerCount <= this.ratioThree) {
        this.changePointCountText(rightAnswerCount);
      }
      if (sumOfCountPoint > this.initialPoints) {
        point += sumOfCountPoint;
      }
      if (sumOfCountPoint === this.initialPoints) {
        point += this.initialPoints;
      }
      if (countCircle <= this.maxCountCircle) {
        countCircle = countCircle + 1;
      }
      this.changeOkRightIcon();
      this.turnOnTheSoundOfRightAnswer();
      this.changeCount(point);
      this.changeSumOfPoints(countCircle);
      this.setCountCircleToLocalStorage(countCircle);
      this.setRightAnswerCountToStorage(rightAnswerCount);
  }

  private countPointsWithIncorrectAnswer(rightAnswerCount: number, countCircle: number) {
      rightAnswerCount = 0;
      countCircle = 0;
      this.changePointCountText(rightAnswerCount);
      this.sprintGameView.changeBorderOfContainer();
      this.turnOnTheSoundOfWrongAnswer();
      this.changeSumOfPoints(countCircle);
      this.setCountCircleToLocalStorage(countCircle);
      this.setRightAnswerCountToStorage(rightAnswerCount);
  }

  private changePointCountText(factor: number) {
    const pointCount = document.querySelector('.point-count-text') as HTMLSpanElement;
    if (factor) {
      pointCount.textContent = String(this.initialPoints * factor);
    } else {
      pointCount.textContent = String(this.initialPoints);
    }
  }

  private changeVolume() {
    const volumeBtn = document.querySelector('.sound-icon') as HTMLDivElement;
    volumeBtn.addEventListener('click', () => {
        volumeBtn.classList.toggle('active');
      if (volumeBtn.classList.contains('active')) {
        this.audio.volume = this.maxVolume;
        volumeBtn.style.backgroundImage = 'url(assets/svg/sound1.svg)';
      } else {
        this.audio.volume = this.minVolume;
        volumeBtn.style.backgroundImage = 'url(assets/svg/no-sound.svg)';
      }
    })
  }

  private setCountCircleToLocalStorage(countCircle: number) {
    this.storage.set('countCircle', countCircle);
  }

  private setRightAnswerCountToStorage(rightAnswerCount: number) {
    this.storage.set('rightAnswerCount', rightAnswerCount);
  }

  private changeCount(point: number) {
    const pointCount = document.querySelector('.point-count') as HTMLSpanElement;
    let points = Number(pointCount.textContent);
    if (point) {
      points += point;
    } else {
      points = point;
    }
    pointCount.textContent = `${points}`;
  }

  private changeSumOfPoints(countCircle: number) {
    if (countCircle > 0) {
      const circle = document.querySelector(`.circle-${countCircle}`) as HTMLButtonElement;
      if (circle) {
        circle.style.background = this.circleActiveBackground;
      }
    } else {
      const circles = document.querySelectorAll('.circle') as NodeList;
      if (circles.length !== 0) {
        circles.forEach((circle) => {
          const copyCircle = circle as HTMLElement;
          copyCircle.style.background = this.circleNoActiveBackground;
        });
      }
    }
  }

  private turnOnTheSoundOfRightAnswer() {
    this.audio.src = '../../../assets/audio/right-answer.mp3';
    this.audio.play();
  }

  private turnOnTheSoundOfWrongAnswer() {
    this.audio.src = '../../../assets/audio/wrong-answer.mp3';
    this.audio.play();
  }

  private changeOkRightIcon() {
    this.sprintGameView.changeOkRightIcon();
  }

  private changeOkUsualIcon() {
    const okIcon = document.querySelector('.ok-icon') as HTMLDivElement;
    okIcon.style.backgroundImage = 'url(assets/svg/ok_circle_icon.svg)';
  }

  private changeUsualBorderOfContainer() {
    const gameContainer = document.querySelector('.sprint-game-container') as HTMLDivElement;
    gameContainer.style.border =  'none';
  }

  private async getWords(group: number, page = 0) {
    return await this.loader.get(`words?page=${page}&group=${group}`);
  }

  private async fillWords(group: number, page = 0) {
    const data = await this.getWords(group, page);
    return data;
  }

  private getRandomNumber(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  private async startGame() {
    const group = this.storage.get('group') as number;
    const words = await this.fillWords(group);
    const firstIndexOfWord = this.getRandomNumber(0, words.length / 4);
    const secondIndexOfWord = this.getRandomNumber(0, words.length / 4);
    this.storage.set('firstIndexOfWord', firstIndexOfWord);
    this.storage.set('secondIndexOfWord', secondIndexOfWord);
    this.sprintGameView.render(words[firstIndexOfWord].word, words[secondIndexOfWord].wordTranslate);
    this.changeVolume();
    this.endGame();
  }

  private endGame() {
    const timer = document.querySelector('.base-timer__label') as HTMLSpanElement;
    setTimeout(() => {
      console.log(timer);
      if (timer && Number(timer.textContent) === 0) {
        console.log('end-game');
        // this.sprintGameView.resetMain();
      }
  }, 60000);
  }
}