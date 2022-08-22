import AudioCallView from '../audio-call-view/audio-call-view'; 
import Loader from '../loader/loader';
import Storage from '../../service/storage/storage';
export default class AudioCallController {
  public view: AudioCallView;
  public loader: Loader;
  public storage: Storage;
  token: string;


  constructor() {
    this.loader = new Loader();
    this.view = new AudioCallView();
    this.storage = new Storage();
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I';
  }
  connectWithView() {
    this.chooseLevel();
  }
  chooseLevel() {
    this.view.renderLevelPage();
    const level = document.querySelectorAll('.level');
    level.forEach((elem) => {
      elem.addEventListener('click', () => {
        console.log(elem);
        const buttonLevel = elem.getAttribute('data-level') as string;
        this.view.renderMainPage();
        this.controlHeart();
        this.fillWords();
        this.storage.set('audioCallLevel', buttonLevel);
      });
    });
  }
  controlHeart() {
    const heart = this.view.createHeart();
    const lifeCounter = document.querySelector('.life-counter') as HTMLDivElement;
    lifeCounter.append(heart);
  }
  fillWords() {
    const data = this.loader.getWords(0, 5);
    console.log(data);
  }
}
