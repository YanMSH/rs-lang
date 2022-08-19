import AudioCallView from '../audioCallView/audioCallView'; 

export default class AudioCallController {
  public view: AudioCallView;

  constructor() {
    this.view = new AudioCallView();
  }
  connectWithView() {
    this.view.renderMainPage();
    this.controlHearth();
  }
  controlHearth() {
    const hearth = this.view.createHearth();
    const lifeCounter = document.querySelector<HTMLDivElement>('.life-counter');
    lifeCounter?.append(hearth);
  }
}
