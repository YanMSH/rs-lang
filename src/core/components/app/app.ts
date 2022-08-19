import AudioCallApp from '../../audiocall/app/audioCallApp';

export default class App {
  public appAudio: AudioCallApp;

  constructor () {
    this.appAudio = new AudioCallApp();
  }
  renderAudioCall() {
    this.appAudio.renderAudioCall();
  }

}

