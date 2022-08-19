import AudioCallApp from '../../audio-call/app/audio-call-app';

export default class App {
  public appAudio: AudioCallApp;

  constructor () {
    this.appAudio = new AudioCallApp();
  }
  renderAudioCall() {
    this.appAudio.renderAudioCall();
  }

}

