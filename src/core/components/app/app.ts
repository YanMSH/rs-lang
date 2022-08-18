import { SprintGameApp } from '../sprintGame/sprintGameApp/sprintGameApp';
export default class App {
  public sprintGameApp: SprintGameApp; 
  constructor() {
    this.sprintGameApp = new SprintGameApp();
  }
  start() {
    this.sprintGameApp.start();
  }
}


