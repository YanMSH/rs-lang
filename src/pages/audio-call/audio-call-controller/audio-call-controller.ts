import AudioCallView from '../audio-call-view/audio-call-view'; 
import Loader from '../loader/loader';
export default class AudioCallController {
  public view: AudioCallView;
  public loader: Loader;
  token: string;


  constructor() {
    this.loader = new Loader();
    this.view = new AudioCallView();
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I';
  }
  connectWithView() {
    this.view.renderMainPage();
    this.controlHeart();
    this.fillWords();
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
