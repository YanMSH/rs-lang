import AudioCallView from '../audio-call-view/audio-call-view'; 

export default class AudioCallController {
  public view: AudioCallView;

  constructor() {
    this.view = new AudioCallView();
  }
  connectWithView() {
    this.view.renderMainPage();
    this.controlHeart();
  }
  controlHeart() {
    const heart = this.view.createHeart();
    const lifeCounter = document.querySelector('.life-counter') as HTMLDivElement;
    lifeCounter.append(heart);
  }
}
