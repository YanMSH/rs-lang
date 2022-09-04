import { SprintGameView } from '../sprint-game-view/sprint-game-view';
import LevelPage from '../../level-page/level-page';
import { sprintLevelMessage } from '../../../core/constants/level-const';
import Storage from '../../../core/components/service/storage/storage';
import Loader from '../../../core/components/loader/loader';
import { CircleBackground , Volume, Ratios } from "../../../core/constants/sprint-game-const";
import { initialPoints, maxCountCircle, minuteInMilisec, indexOfFifthWord } from "../../../core/constants/sprint-game-const";
import { Word, Stat } from '../../../core/types/controller-types';
import { Timer } from '../timer/timer';
import ModalWindowController from '../../modal-window/modal-window-controller/modal-window-controller';
import TextbookPage from '../../textbook/textbook-page';
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
  private timer: Timer;
  private timerTimeout: number | undefined;
  private minuteInMilisec: number;
  private indexOfFifthWord: number;
  private modal: ModalWindowController;
  public gameStatistic: Stat;
  public globalStatistic: Stat;
  
  

  constructor() {
    this.sprintGameView = new SprintGameView();
    this.levelPage = new LevelPage();
    this.sprintLevelMessage = sprintLevelMessage;
    this.storage = new Storage();
    this.loader = new Loader();
    this.audio = new Audio();
    this.circleActiveBackground = CircleBackground.circleActiveBackground;
    this.circleNoActiveBackground = CircleBackground.circleNoActiveBackground;
    this.minVolume = Volume.minVolume;
    this.maxVolume = Volume.maxVolume;
    this.initialPoints = initialPoints;
    this.ratioOne = Ratios.ratioOne;
    this.ratioTwo = Ratios.ratioTwo;
    this.ratioThree = Ratios.ratioThree;
    this.maxCountCircle = maxCountCircle;
    this.timer = new Timer();
    this.timerTimeout = 0;
    this.minuteInMilisec = minuteInMilisec;
    this.indexOfFifthWord = indexOfFifthWord;
    this.modal = new ModalWindowController();
    this.globalStatistic = {};
    this.gameStatistic = (JSON.parse(this.storage.get('gameStatistic') as string) as Stat) ? JSON.parse(this.storage.get('gameStatistic') as string) as Stat : {};
  }

  public render() {
    this.chooseLevel();
  }

  public async startGame() {
    this.clearTimeoutOfTimer();
    const page = Number(this.storage.get('page'));
    const group = this.storage.get('group') as number;
    const words = await this.fillWords(group, page);
    const firstIndexOfWord = this.getRandomNumber(0, this.indexOfFifthWord);
    const secondIndexOfWord = this.getRandomNumber(0, this.indexOfFifthWord);
    this.storage.set('firstIndexOfWord', firstIndexOfWord);
    this.storage.set('secondIndexOfWord', secondIndexOfWord);
    this.updateLocalStatistic();
    this.sprintGameView.render(words[firstIndexOfWord].word, words[secondIndexOfWord].wordTranslate);
    this.changeFullSreen();
    this.changeVolume();
    this.changeWords(page);
    this.setCountCircleToLocalStorage(0); 
    this.setRightAnswerCountToStorage(0);
    this.endGameTimeout();
  }

  public clearTimeoutOfTimer() {
    clearTimeout(this.timerTimeout);
  }

  private endGameTimeout() {
    const timer = document.querySelector('.base-timer__label') as HTMLSpanElement;
    this.timerTimeout = setTimeout(() => {
      if (timer && Number(timer.textContent) === 0) {
        this.modal.renderModalWindow();
        this.disableButtons();
        this.controlModalWindow()
      }
    }, this.minuteInMilisec);
  }

  private endGameWordsOut() {
    this.clearTimeoutOfTimer();
    this.timer.resetTimer();
    this.modal.renderModalWindow();
    this.disableButtons();
    this.controlModalWindow();
  }

  private chooseLevel() {
    this.levelPage.renderLevelPage('wrapper-sprint', this.sprintLevelMessage);
    const level = document.querySelectorAll('.level');
    level.forEach((elem) => {
      elem.addEventListener('click', async () => {
        const buttonLevel = Number(elem.getAttribute('data-level'));
        this.storage.set('group', buttonLevel - 1);
        this.startGame();
      });
    });
  }

  private async changeWords(page: number) {
    const group = this.storage.get('group') as number;
    const words = await this.fillWords(group, page);
    const answersButtons = document.querySelector('.answers-button') as HTMLDivElement;
    const sumPoint = document.querySelector('.point-count') as HTMLSpanElement;
    const point = Number(sumPoint.textContent);
    let offset = 0;
    const maxOffSet = words.length - 4;
    answersButtons.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains('answer-btn')) {
        const rightAnswerCount = this.storage.get('rightAnswerCount') as number;
        const countCircle = this.storage.get('countCircle') as number;
        if (target.classList.contains('wrong-answer-btn')) {
          this.checkWrongAnswer(point, countCircle, rightAnswerCount, words);
        } else if (target.classList.contains('right-answer-btn')) {
          this.checkRightAnswer(point, countCircle, rightAnswerCount, words);
        }

        if (offset < maxOffSet) {
          const lastRandomNumber = this.indexOfFifthWord + Number(`${offset}`);
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
          this.endGameWordsOut();
        }
      }
    });
    
    document.addEventListener('keydown', (event) => {
      if (event.code == 'ArrowLeft' || event.code == 'ArrowRight') {
        const rightAnswerCount = this.storage.get('rightAnswerCount') as number;
        const countCircle = this.storage.get('countCircle') as number;
        if (event.code == 'ArrowLeft') {
          this.checkWrongAnswer(point, countCircle, rightAnswerCount, words);
        } else if (event.code == 'ArrowRight') {
          this.checkRightAnswer(point, countCircle, rightAnswerCount, words);
        }

        if (offset < maxOffSet) {
          const lastRandomNumber = this.indexOfFifthWord + Number(`${offset}`);
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
          this.endGameWordsOut();
        }
      }
    });
  }

  private disableButtons() {
    const wrongAnswerBtn = document.querySelector('.wrong-answer-btn') as HTMLButtonElement;
    const rightAnswerBtn = document.querySelector('.right-answer-btn') as HTMLButtonElement;
    wrongAnswerBtn.disabled = true;
    rightAnswerBtn.disabled = true;
  }

  private checkRightAnswer(point: number, countCircle: number, rightAnswerCount: number, words: Array<Word>) {
    const prevFirstIndexOfWord =  this.storage.get('firstIndexOfWord') as number;
    const prevSecondIndexOfWord = this.storage.get('secondIndexOfWord') as number;
    const pointCount = document.querySelector('.point-count-text') as HTMLSpanElement;
    const sumOfCountPoint = Number(pointCount.textContent);
    if (prevFirstIndexOfWord === prevSecondIndexOfWord) {
      this.countPointsWithCorrectAnswer(rightAnswerCount, sumOfCountPoint, point, countCircle);
      this.addToStatisticRightWord(words[prevFirstIndexOfWord]);
    } else {
      this.countPointsWithIncorrectAnswer(rightAnswerCount, countCircle);
      this.addToStatisticWrongWord(words[prevFirstIndexOfWord]);
    }
  }

  private checkWrongAnswer(point: number, countCircle: number, rightAnswerCount: number, words: Array<Word>) {
    const prevFirstIndexOfWord =  this.storage.get('firstIndexOfWord') as number;
    const prevSecondIndexOfWord = this.storage.get('secondIndexOfWord') as number;
    const pointCount = document.querySelector('.point-count-text') as HTMLSpanElement;
    const sumOfCountPoint = Number(pointCount.textContent);
    if (prevFirstIndexOfWord === prevSecondIndexOfWord) {
      this.countPointsWithIncorrectAnswer(rightAnswerCount, countCircle);
      this.addToStatisticWrongWord(words[prevFirstIndexOfWord]);
    } else {
      this.countPointsWithCorrectAnswer(rightAnswerCount, sumOfCountPoint, point, countCircle);
      this.addToStatisticRightWord(words[prevFirstIndexOfWord]);
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

  private addToStatisticRightWord(buildWord: Word) {
      if (this.gameStatistic[buildWord.word]) {
        this.gameStatistic[buildWord.word].local += 1;
        this.gameStatistic[buildWord.word].global += 1;
        this.gameStatistic[buildWord.word].general += 1;
        this.gameStatistic[buildWord.word].option = [buildWord.word, buildWord.wordTranslate, buildWord.audio]; 
        this.gameStatistic[buildWord.word].inThisGame = true;
      } else {
        this.gameStatistic[buildWord.word] = {};
        this.gameStatistic[buildWord.word].local = 1;
        this.gameStatistic[buildWord.word].global = 1;
        this.gameStatistic[buildWord.word].general = 1;
        this.gameStatistic[buildWord.word].option = [buildWord.word, buildWord.wordTranslate, buildWord.audio];
        this.gameStatistic[buildWord.word].inThisGame = true;
      }
      this.storage.set('gameStatistic', JSON.stringify(this.gameStatistic));
  }

  private addToStatisticWrongWord(buildWord: Word) {
    if (this.gameStatistic[buildWord.word]) {
      this.gameStatistic[buildWord.word].local = 0;
      this.gameStatistic[buildWord.word].general += 1;
      this.gameStatistic[buildWord.word].option = [buildWord.word, buildWord.wordTranslate, buildWord.audio]; 
      this.gameStatistic[buildWord.word].inThisGame = true;
    } else {
      this.gameStatistic[buildWord.word] = {};
      this.gameStatistic[buildWord.word].local = 0;
      this.gameStatistic[buildWord.word].global = 0;
      this.gameStatistic[buildWord.word].general = 1;
      this.gameStatistic[buildWord.word].option = [buildWord.word, buildWord.wordTranslate, buildWord.audio];
      this.gameStatistic[buildWord.word].inThisGame = true;
    }
    this.storage.set('gameStatistic', JSON.stringify(this.gameStatistic));
  }

  private updateLocalStatistic() {
    for (const stat in this.gameStatistic) {
      this.gameStatistic[stat].local = 0;
      this.gameStatistic[stat].inThisGame = false;
    }
    this.storage.set('gameStatistic', JSON.stringify(this.gameStatistic));
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

  private changeFullSreen() {
    const game = document.querySelector('.game-wrapper') as HTMLDivElement;
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.hasAttribute('data-toggle-fullscreen')) return;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        game.requestFullscreen();
      }

    }, false);
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
    if (gameContainer) {
      gameContainer.style.border =  'none';
    }
    
  }

  private async getWords(group: number, page = 0) {
    return await this.loader.get(`words?page=${page}&group=${group}`);
  }

  private async fillWords(group: number, page: number) {
    let data = await this.getWords(group, page);
    let prevData = [] as Array<Word>;
    while (page) {
      prevData = await this.getWords(group, page - 1) as Array<Word>;
      data = data.concat(prevData);
      page -= 1;
    }
    return data;
  }

  private getRandomNumber(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  private controlModalWindow() {
    const textBook = document.querySelector('.textbook');
    const refresh = document.querySelector('.refresh');
    const modalWindow = document.querySelector('.modal');
    refresh?.addEventListener('click', () => {
      this.startGame();
      modalWindow?.remove();
    });
    textBook?.addEventListener('click', () => {
      new TextbookPage().render();
      modalWindow?.remove();
    });
  }
}