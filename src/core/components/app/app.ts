import { SprintGameApp } from '../sprint-game/app/sprint-game-app';
import AudioCallApp from '../audio-call/app/audio-call-app';
export default class App {
  public sprintGameApp: SprintGameApp; 
  public appAudio: AudioCallApp;
  constructor() {
    this.sprintGameApp = new SprintGameApp();
    this.appAudio = new AudioCallApp();
  }
  //TODO: Добавить действие по нажанию на кнопки в Header
  // starting() {
  //   this.sprintGameApp.starting();
  // }
  renderAudioCall() {
    this.appAudio.renderAudioCall();
  }
}
