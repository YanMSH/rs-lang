import { SprintGameApp } from '../sprint-game/app/sprint-game-app';
export default class App {
  public sprintGameApp: SprintGameApp; 
  constructor() {
    this.sprintGameApp = new SprintGameApp();
  }
  starting() {
    this.sprintGameApp.starting();
  }
}


