import AudioCallController from "../audioCallcontroller/audioCallController";

export default class AudioCallApp {

  public controller: AudioCallController;

  constructor() {
    this.controller = new AudioCallController();
  }
  connectWithController() {
    this.controller.connectWithView();
  }

  renderAudioCall() {
    this.connectWithController();
  }

}

